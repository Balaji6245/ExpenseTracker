import { Request, Response, Utils, ExpenseModel, StatusCodes, Responder, AdminMsg, ExpeMsg, Enum, mongoose } from '../../helpers/path';

class transaction {
    constructor() { }

    createExpense = async (req: Request, res: Response) => {
        let data = req?.body;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        if (!data?.type || !data?.amount)
            return Responder.sendFailureMessage(AdminMsg.validField, StatusCodes.NO_CONTENT, res);

        data['user'] = verifyToken?.id;

        let createTrans = await ExpenseModel.create(data);
        if (createTrans) Responder.sendSuccessData({ expense: createTrans }, ExpeMsg.created, StatusCodes.CREATED, res);
        else Responder.sendFailureMessage(ExpeMsg.create404, StatusCodes.FORBIDDEN, res);
    }

    updateExpense = async (req: Request, res: Response) => {
        let id = req?.params?.id;
        let data = req?.body;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let expense = await ExpenseModel.findOne({ _id: id, active: Enum.STATUS.ACTIVE });
        if (!expense) return Responder.sendFailureMessage(ExpeMsg.expense404, StatusCodes.NOT_FOUND, res);

        let updateExpense = await ExpenseModel.findOneAndUpdate({ _id: expense?._id, active: Enum.STATUS.ACTIVE }, data, { new: true }).exec();
        if (updateExpense) Responder.sendSuccessData({ data: updateExpense }, ExpeMsg.update, StatusCodes.OK, res);
        else Responder.sendFailureMessage(ExpeMsg.update404, StatusCodes.NOT_MODIFIED, res);
    }

    epense = async (req: Request, res: Response) => {
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let query = {
            _id: await Utils.retrunObjectId(id),
            active: Enum.STATUS.ACTIVE
        }

        let aggregateField = [
            await Utils.lookupPipeline('banks', 'bank', '_id', 'bank'),
            await Utils.unwindPipeline('$bank'),
            await Utils.lookupPipeline('categories', 'category', '_id', 'category'),
            await Utils.unwindPipeline('$category'),
            await Utils.matchPipeline(query)
        ]

        let expense = await ExpenseModel.aggregate(aggregateField);
        if (expense) Responder.sendSuccessData({ expense: expense[0] }, ExpeMsg.expense, StatusCodes.OK, res);
        else Responder.sendFailureMessage(ExpeMsg.expense404, StatusCodes.NOT_FOUND, res);
    }

    expenses = async (req: Request, res: Response) => {
        let query: any = req?.query;
        let { page, limit } = await Utils.returnPageLimit(query);

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        await Utils.dateQuery(query);

        if (query?.bank) await Utils.appendRegex(query, 'bank', query?.bank);
        if (query?.category) await Utils.appendRegex(query, 'category', query?.category);
        if (query?.type) await Utils.appendRegex(query, 'type', query?.type);

        let aggregateField = [
            await Utils.lookupPipeline('banks', 'bank', '_id', 'bank'),
            await Utils.unwindPipeline('$bank'),
            await Utils.lookupPipeline('categories', 'category', '_id', 'category'),
            await Utils.unwindPipeline('$category'),
            await Utils.matchPipeline(query),
            {
                $skip: page * limit
            },
            {
                $limit: limit
            }
        ]

        let expenses = await ExpenseModel.aggregate(aggregateField);
        if (expenses) Responder.sendSuccessData(expenses, ExpeMsg.expense, StatusCodes.OK, res);
        else Responder.sendFailureMessage(ExpeMsg.expense404, StatusCodes.NOT_FOUND, res);
    }

    deleteExpense = async (req: Request, res: Response) => {
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let query = {
            _id: await Utils.retrunObjectId(id),
            active: Enum.STATUS.ACTIVE
        }

        let deleteExpense = await ExpenseModel.findOneAndUpdate(query, { active: Enum.STATUS.DELETE }, { new: true }).exec();
        if (deleteExpense) Responder.sendSuccessMessage(ExpeMsg.delete, StatusCodes.OK, res);
        else Responder.sendFailureMessage(ExpeMsg.delete404, StatusCodes.NOT_MODIFIED, res);
    }

}

export const Controller = new transaction();