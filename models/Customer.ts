// models/Customer.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    phone: string;
    purchases: string;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: [true, 'Customer name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    purchases: { type: String, required: [true, 'Purchase total is required'], default: '$0.00' },
}, { timestamps: true });

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
