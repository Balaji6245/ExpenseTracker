import { AdminMsg, BankModel, BankMsg, Enum, Request, Responder, Response, StatusCodes, Utils } from '../../helpers/path'

class Bank {
    constructor() { }

    createBank = async (req: Request, res: Response) => {
        let data = req?.body;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        if (!data?.name || !data?.ifsc || !data.acc_no || !data?.branch)
            return Responder.sendFailureMessage(AdminMsg.validField, StatusCodes.BAD_REQUEST, res);

        data['user'] = verifyToken?.id;

        let createBank = await BankModel.create(data);
        if (createBank) return Responder.sendSuccessData({ createBank }, BankMsg.created, StatusCodes.CREATED, res);
        else Responder.sendFailureMessage(BankMsg.created404, StatusCodes.NO_CONTENT, res);
    }

    getAllBanks = async (req: Request, res: Response) => {
        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let banks = await BankModel.find({ user: verifyToken?.id, active: Enum.STATUS.ACTIVE });
        if (banks) Responder.sendSuccessData({ banks }, BankMsg.allBanks, StatusCodes.OK, res);
        else Responder.sendFailureMessage(BankMsg.allBank404, StatusCodes.NOT_FOUND, res);
    }

    getBankDetail = async (req: Request, res: Response) => {
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let userId = verifyToken?.id

        let bank = await BankModel.findOne({ _id: id, user: userId, active: Enum.STATUS.ACTIVE });
        if (bank) Responder.sendSuccessData({ bank }, BankMsg.bankDetail, StatusCodes.OK, res);
        else Responder.sendFailureMessage(BankMsg.bankDetail404, StatusCodes.NOT_FOUND, res);
    }

    updateBank = async (req: Request, res: Response) => {
        let data = req?.body;
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let userId = verifyToken?.id

        let updateBank = await BankModel.findOneAndUpdate({ _id: id, user: userId, active: Enum.STATUS.ACTIVE }, data, { new: true }).exec();
        if (updateBank) Responder.sendSuccessData({ updateBank }, BankMsg.updateBank, StatusCodes.OK, res);
        else Responder.sendFailureMessage(BankMsg.updateBank404, StatusCodes.NOT_MODIFIED, res);
    }

    deleteBank = async (req: Request, res: Response) => {
        let id = req?.params?.id;

        let token = await Utils.getToken(req);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyToken = await Utils.verifyToken(token);
        if (!verifyToken) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let userId = verifyToken?.id

        let deleteBank = await BankModel.findOneAndUpdate({ _id: id, user: userId, active: Enum.STATUS.ACTIVE }, { active: Enum.STATUS.DELETE }, { new: true }).exec();
        if (deleteBank) Responder.sendSuccessMessage(BankMsg.bankDelete, StatusCodes.OK, res);
        else Responder.sendFailureMessage(BankMsg.bankDelete404, StatusCodes.NOT_MODIFIED, res);
    }
}

export const Controller = new Bank();