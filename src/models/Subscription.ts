import { Schema, model } from 'mongoose';

export interface ISubscription {
    email: string;
    city: string;
    frequency: 'hourly' | 'daily';
    confirmed: boolean;
    token: string;
}

const SubscriptionSchema = new Schema<ISubscription>({
  email: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  frequency: { type: String, enum: ['hourly', 'daily'], required: true },
  confirmed: { type: Boolean, default: false },
  token: { type: String, required: true },
});

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
