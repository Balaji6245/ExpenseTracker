import { mongoose } from '../helpers/path';

export async function connectDB() {
    await mongoose.connect(process.env.DB_STRING + "expense_tracker")
        .then(() => console.log(`Database connected successfully`.green.bold))
        .catch(() => console.log(`Database could not connect`.red.bold))
}