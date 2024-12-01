import { Request, Response, Utils, AdminModel, Responder, StatusCodes, AdminMsg, crypto, Enum } from '../../helpers/path';

class authenticate {
    constructor() { }

    register = async (req: Request, res: Response) => {
        let data = req?.body;

        if (!data?.user_name || !data?.password || !data?.email)
            return Responder.sendFailureMessage(AdminMsg.validField, StatusCodes.BAD_REQUEST, res);

        data['password'] = await Utils.encryptPass(data?.password);
        let createAdmin = await AdminModel.create(data);
        if (!createAdmin) return Responder.sendFailureMessage(AdminMsg.notCreated, StatusCodes.NOT_FOUND, res);

        let token = await Utils.generateJwt(createAdmin?._id);
        Responder.sendSuccessData({ token }, AdminMsg.created, StatusCodes.OK, res)
    }

    login = async (req: Request, res: Response) => {
        let data = req?.body;

        if (!data?.email || !data?.password)
            return Responder.sendFailureMessage(AdminMsg.validField, StatusCodes.BAD_REQUEST, res);

        let encryptPass = await Utils.encryptPass(data?.password);

        let admin = await AdminModel.findOne({ email: data?.email, password: encryptPass, active: Enum.STATUS.ACTIVE });
        if (!admin) return Responder.sendFailureMessage(AdminMsg.invalidCre, StatusCodes.UNAUTHORIZED, res);

        let token = await Utils.generateJwt(admin?._id);
        Responder.sendSuccessData({ token }, AdminMsg.login, StatusCodes.OK, res)
    }

    forgetPassword = async (req: Request, res: Response) => {
        let data = req?.body;

        if (!data?.email || !data?.new_password)
            return Responder.sendFailureMessage(AdminMsg.validField, StatusCodes.BAD_REQUEST, res);

        let admin = await AdminModel.findOne({ email: data?.email, active: Enum.STATUS.ACTIVE });
        if (!admin) return Responder.sendFailureMessage(AdminMsg.invalidCre, StatusCodes.UNAUTHORIZED, res);

        data['password'] = await Utils.encryptPass(data?.new_password);

        let updateAdmin = await AdminModel.findOneAndUpdate({ email: data?.email, active: Enum.STATUS.ACTIVE }, data, { new: true });
        if (updateAdmin) Responder.sendSuccessMessage(AdminMsg.passUpdated, StatusCodes.OK, res);
        else Responder.sendFailureMessage(AdminMsg.passUpdated404, StatusCodes.NOT_MODIFIED, res);
    }
}

export const Controller = new authenticate();