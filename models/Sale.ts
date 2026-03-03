// models/Sale.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISale extends Document {
    customerName: string;
    customerId?: string;
    items: {
        medicineId: string;
        name: string;
        quantity: number;
        price: string;
    }[];
    totalAmount: string;
    profit: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}

const SaleSchema: Schema = new Schema({
    customerName: { type: String, required: [true, 'Customer name is required'], trim: true },
    customerId: { type: String, required: false },
    items: [{
        medicineId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: String, required: true }
    }],
    totalAmount: { type: String, required: true },
    profit: { type: String, required: true },
    date: { type: String, required: true, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
