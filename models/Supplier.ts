// models/Supplier.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISupplier extends Document {
    name: string;
    phone: string;
    purchases: string;
    createdAt: Date;
    updatedAt: Date;
}

const SupplierSchema: Schema = new Schema({
    name: { type: String, required: [true, 'Supplier name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    purchases: { type: String, required: [true, 'Total distribution value is required'], default: '$0.00' },
}, { timestamps: true });

const Supplier: Model<ISupplier> = mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', SupplierSchema);

export default Supplier;
