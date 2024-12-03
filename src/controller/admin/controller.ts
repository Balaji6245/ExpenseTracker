import { Request, Response, AdminModel, AdminMsg, StatusCodes, Utils, Responder, Enum } from '../../helpers/path';

class Admin {
    constructor() { }

    adminDetail = async (req: Request, res: Response) => {
        let token = await Utils.getToken(req, res);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyUser = await Utils.verifyToken(token);
        if (!verifyUser) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        let adminDetail = await AdminModel.findOne({ _id: verifyUser?.id, active: Enum.STATUS.ACTIVE });
        if (adminDetail) Responder.sendSuccessData({ admin: adminDetail }, AdminMsg.adminDetail, StatusCodes.OK, res);
        else Responder.sendFailureMessage(AdminMsg.adminDetail404, StatusCodes.NOT_FOUND, res);
    }

    updateAdmin = async (req: Request, res: Response) => {
        let data = req?.body;

        let token = await Utils.getToken(req, res);
        if (!token) return Responder.sendFailureMessage(AdminMsg.noAuthAcc, StatusCodes.UNAUTHORIZED, res);

        let verifyUser = await Utils.verifyToken(token);
        if (!verifyUser) return Responder.sendFailureMessage(AdminMsg.tokenExp, StatusCodes.UNAUTHORIZED, res);

        delete data?.password

        let updateAdmin = await AdminModel.findOneAndUpdate({ _id: verifyUser?.id, active: Enum.STATUS.ACTIVE }, data, { new: true }).exec();
        if (updateAdmin) Responder.sendSuccessData({ updateAdmin }, AdminMsg.update, StatusCodes.OK, res);
        else Responder.sendFailureMessage(AdminMsg.update404, StatusCodes.NOT_MODIFIED, res);
    }

    logout = async (req: Request, res: Response) => {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        Responder.sendSuccessMessage(AdminMsg.logout, StatusCodes.OK, res);
    }
}

export const Controller = new Admin()