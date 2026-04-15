// models/Medicine.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    batch: string;
    expiry: string;
    stock: number;
    purchasePrice: string;
    sellPrice: string;
    barcode: string;
    price: string;
    createdAt: Date;
    updatedAt: Date;
}

const MedicineSchema: Schema = new Schema({
    name: { type: String, required: [true, 'Medicine name is required'], trim: true },
    batch: { type: String, required: [true, 'Batch number is required'], trim: true },
    expiry: { type: String, required: [true, 'Expiry date is required'] },
    stock: { type: Number, required: [true, 'Stock quantity is required'], min: [0, 'Stock cannot be negative'], default: 0 },
    purchasePrice: { type: String, required: [true, 'Purchase price is required'], trim: true },
    sellPrice: { type: String, required: [true, 'Sell price is required'], trim: true },
    barcode: { type: String, trim: true, default: '' },
    price: { type: String, trim: true }, // Legacy field, will store sell price
}, { timestamps: true });

MedicineSchema.pre('save', async function (this: any) {
    this.price = this.sellPrice;
});

const Medicine: Model<IMedicine> = mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);

export default Medicine;
