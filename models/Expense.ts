// models/Expense.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: string;
    date: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
    title: { type: String, required: [true, 'Expense title is required'], trim: true },
    amount: { type: String, required: [true, 'Amount is required'], trim: true },
    date: { type: String, required: [true, 'Date is required'] },
    notes: { type: String, trim: true },
}, { timestamps: true });

const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
