import { Schema, Document, Enum, model } from "../helpers/path";

let options = {
    timestamps: true,
    versionkey: true
}

let requiredString = { type: String, required: true };

interface IPhone {
    country_code: string,
    national_number: string
}

interface IAdmin extends Document {
    user_name: string,
    password: string,
    email: string,
    phone: IPhone,
    active: number
}

let adminSchema = new Schema<IAdmin>({
    user_name: requiredString,
    password: requiredString,
    email: requiredString,
    phone: Object,
    active: { type: Number, default: Enum.STATUS.ACTIVE }
}, options);

export const AdminModel = model<IAdmin>('admin', adminSchema);
