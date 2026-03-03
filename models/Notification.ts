// models/Notification.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    type: 'expiry' | 'stock' | 'system';
    message: string;
    status: 'unread' | 'read';
    relatedId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
    type: { type: String, required: true, enum: ['expiry', 'stock', 'system'] },
    message: { type: String, required: true },
    status: { type: String, required: true, enum: ['unread', 'read'], default: 'unread' },
    relatedId: { type: String },
}, { timestamps: true });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
