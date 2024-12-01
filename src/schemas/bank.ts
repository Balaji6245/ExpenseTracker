import { Schema, Document, model, ObjectId, mongoose, Enum } from "../helpers/path";

let options = {
    timestamps: true,
    versionkey: true
}

let requiredString = { type: String, required: true }

interface IBank extends Document {
    name: string,
    ifsc: string,
    acc_no: string,
    branch: string,
    user_id: ObjectId, // Save admin objectId from admin collection
    active: number
}

let bankSchema = new Schema<IBank>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    name: requiredString,
    ifsc: requiredString,
    acc_no: requiredString,
    branch: requiredString,
    active: { type: Number, default: Enum.STATUS.ACTIVE }
}, options);

export const BankModel = model<IBank>('bank', bankSchema);