// models/Medicine.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    batch: string;
    expiry: string;
    stock: number;
    price: string;
    createdAt: Date;
    updatedAt: Date;
}

const MedicineSchema: Schema = new Schema({
    name: { type: String, required: [true, 'Medicine name is required'], trim: true },
    batch: { type: String, required: [true, 'Batch number is required'], trim: true },
    expiry: { type: String, required: [true, 'Expiry date is required'] },
    stock: { type: Number, required: [true, 'Stock quantity is required'], min: [0, 'Stock cannot be negative'], default: 0 },
    price: { type: String, required: [true, 'Price is required'], trim: true },
}, { timestamps: true });

const Medicine: Model<IMedicine> = mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);

export default Medicine;
