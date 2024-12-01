import { Schema, Document, model, Enum } from "../helpers/path";

let options = {
    timestamps: true,
    versionkey: false
}

let requiredString = { type: String, required: true }

interface ICategory extends Document {
    name: string,
    description: string,
    active: number
}

let categorySchema = new Schema<ICategory>({
    name: requiredString,
    description: requiredString,
    active: { type: Number, default: Enum.STATUS.ACTIVE }
}, options);

export const CategoryModel = model<ICategory>('category', categorySchema);