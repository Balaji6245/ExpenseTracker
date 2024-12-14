import { StatusCodes, Response } from '../helpers/path'

class ResponderClass {
    constructor() { }

    sendSuccessMessage = async (message: string, code: number, res: Response) => {
        res.setHeader('content-type', 'application/json');
        let result = {
            success: true,
            message,
        }
        res.status(code).end(JSON.stringify(result));
    }

    sendSuccessData = async (data: any, message: string, code: number, res: Response) => {
        res.setHeader('content-type', 'application/json');
        let result = {
            success: true,
            message,
            data
        }
        res.status(code).end(JSON.stringify(result));
    }

    sendFailureMessage = async (message: string, code: number, res: Response) => {
        res.setHeader('content-type', 'application/json');
        let result = {
            success: false,
            message
        }
        res.status(code).end(JSON.stringify(result));
    }

    sendNoUser = async (res: Response) => {
        await this.sendFailureMessage("Admin account not found!", StatusCodes.NOT_FOUND, res)
    }
}

export const Responder = new ResponderClass();