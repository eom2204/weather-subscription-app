"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const SubscriptionSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    frequency: { type: String, enum: ['hourly', 'daily'], required: true },
    confirmed: { type: Boolean, default: false },
    token: { type: String, required: true },
});
exports.Subscription = (0, mongoose_1.model)('Subscription', SubscriptionSchema);
