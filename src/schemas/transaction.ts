import { Schema, Document, model, ObjectId, Enum, mongoose } from "../helpers/path";

let options = {
    timestamps: true,
    versionkey: true
}

let requiredString = { type: String, required: true }
let requiredAmount = { type: Number, required: true }

interface ITransaction extends Document {
    user_id: ObjectId, // Save admin objectId from admin collection
    type: String, // Income (or) Expense
    category: ObjectId, // Save category objectId from category collection
    bank: ObjectId, // Save bank objectId from bank collection
    amount: number,
    description: string,
    date: Date,
    reference_id: string,
    active: number
}

let transactionSchema = new Schema<ITransaction>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    bank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bank'
    },
    amount: requiredAmount,
    type: requiredString,
    description: String,
    date: Date,
    reference_id: String,
    active: { type: Number, default: Enum.STATUS.ACTIVE }
}, options);

export const TransactionModel = model<ITransaction>('transaction', transactionSchema);