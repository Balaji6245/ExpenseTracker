import { jwt, crypto, ObjectId } from "./path";

class Util {
    constructor() { }

    generateJwt = async (id: any) => {
        return jwt.sign({ id: id }, process.env.SECRET_KEY!, {
            expiresIn: process.env.EXPIRATION_TIME
        })
    }

    encryptPass = async (password: string) => {
        return crypto.createHash('md5').update(password).digest('hex')
    }
}

export const Utils = new Util();