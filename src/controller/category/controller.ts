import { Request, Response, Utils, CategoryModel, StatusCodes, Responder, AdminMsg, CatMsg, Enum } from '../../helpers/path';

class Category {
    constructor() { }

    createCategory = async (req: Request, res: Response) => {
        let data = req?.body;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        if (!data?.name) return Responder.sendFailureMessage(AdminMsg.validField, StatusCodes.BAD_REQUEST, res);

        let categoryExsist = await this.checkCategory(data);
        if (categoryExsist) return Responder.sendFailureMessage(`${data?.name} ${CatMsg.catExsist}`, StatusCodes.FORBIDDEN, res)

        let category = await CategoryModel.create(data);
        if (category) Responder.sendSuccessData({ category }, CatMsg.created, StatusCodes.OK, res);
        else Responder.sendFailureMessage(CatMsg.created, StatusCodes.NO_CONTENT, res);
    }

    categories = async (req: Request, res: Response) => {
        let query: any = req?.query;
        let { page, limit } = await Utils.returnPageLimit(query)

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        query['active'] = Enum.STATUS.ACTIVE;
        let categories = await CategoryModel.find(query).skip(page * limit).limit(limit).exec();

        if (categories) Responder.sendSuccessData({ categories }, CatMsg.catList, StatusCodes.OK, res);
        else Responder.sendFailureMessage(CatMsg.catList404, StatusCodes.NOT_FOUND, res);
    }

    Category = async (req: Request, res: Response) => {
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let category = await CategoryModel.findOne({ _id: id, active: Enum.STATUS.ACTIVE });
        if (category) Responder.sendSuccessData({ category }, CatMsg.category, StatusCodes.OK, res);
        else Responder.sendFailureMessage(CatMsg.category404, StatusCodes.NOT_FOUND, res);
    }

    updateCategory = async (req: Request, res: Response) => {
        let id = req?.params?.id;
        let data = req?.body;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let checkCategory = await this.checkCategory(data);
        if (checkCategory) return Responder.sendFailureMessage(CatMsg.catExsist, StatusCodes.BAD_REQUEST, res);

        let updateCategory = await CategoryModel.findOneAndUpdate({ _id: id, active: Enum.STATUS.ACTIVE }, data, { new: true }).exec();
        if (updateCategory) Responder.sendSuccessData({ category: updateCategory }, CatMsg.updCat, StatusCodes.OK, res);
        else Responder.sendFailureMessage(CatMsg.updCat404, StatusCodes.NOT_MODIFIED, res);
    }

    deleteCategory = async (req: Request, res: Response) => {
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let deleteCategory = await CategoryModel.findOneAndUpdate({ _id: id, active: Enum.STATUS.ACTIVE }, { active: Enum.STATUS.DELETE }, { new: true }).exec();
        if (deleteCategory) Responder.sendSuccessMessage(CatMsg.deleteCat, StatusCodes.OK, res);
        else Responder.sendFailureMessage(CatMsg.deleteCat404, StatusCodes.NOT_MODIFIED, res);
    }

    checkCategory = async (data: any) => {
        return await CategoryModel.findOne({ name: data?.name });
    }
}
export const Controller = new Category();