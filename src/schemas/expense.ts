import { Schema, Document, model, ObjectId, Enum, mongoose } from "../helpers/path";

let options = {
    timestamps: true,
    versionkey: false
}

let requiredString = { type: String, required: true }
let requiredAmount = { type: Number, required: true }

interface IExpense extends Document {
    user: ObjectId, // Save admin objectId from admin collection
    type: String, // Income (or) Expense
    category: ObjectId, // Save category objectId from category collection
    bank: ObjectId, // Save bank objectId from bank collection
    amount: number,
    description: string,
    reference_id: string,
    active: number
}

let expenseSchema = new Schema<IExpense>({
    user: {
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
    reference_id: String,
    active: { type: Number, default: Enum.STATUS.ACTIVE }
}, options);

export const ExpenseModel = model<IExpense>('expense', expenseSchema);