import { jwt, crypto, ObjectId, Request, Responder, AdminMsg, StatusCodes, Response, AdminModel, Enum, mongoose } from "./path";

class Util {
    constructor() { }

    generateJwt = async (id: any) => {
        return jwt.sign({ id: id }, process.env.SECRET_KEY!, /*{
            expiresIn: process.env.EXPIRATION_TIME
        }*/)
    }

    encryptPass = async (password: string) => {
        return crypto.createHash('md5').update(password).digest('hex')
    }

    getToken = async (req: Request) => {
        let token: any
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1]
        }
        return token;
    }

    verifyToken = async (token: string) => {
        let decode: any = jwt.verify(token, process.env.SECRET_KEY!); //{ id: '674c3c631a95a0b2838dbeb0', iat: 1733061880, exp: 1733061966 }
        // if ((Math.floor(Date.now() / 1000)) > decode['exp'])
        if (decode)
            return decode;
        else return null;
    }

    appendRegex = async (query: any, field: string, value: any) => {
        query[field] = { $regex: new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), 'i') }
    }

    retrunObjectId = async (id: string) => {
        return new mongoose.Types.ObjectId(id)
    }

    returnPageLimit = async (query: any) => {
        let page: number = parseInt(query?.page ?? 1) - 1;
        let limit: number = parseInt(query?.limit ?? 10);

        delete query?.page;
        delete query?.limit;

        return { page, limit }
    }
}

export const Utils = new Util();