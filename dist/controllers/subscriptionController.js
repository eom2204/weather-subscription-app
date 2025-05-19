"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = exports.confirmSubscription = exports.subscribe = void 0;
const Subscription_1 = require("../models/Subscription");
const uuid_1 = require("uuid");
const emailService_1 = require("../services/emailService");
const subscribe = async (req, res) => {
    const { email, city, frequency } = req.body;
    try {
        const existing = await Subscription_1.Subscription.findOne({ email });
        if (existing)
            return res.status(409).send('Email already subscribed');
        const token = (0, uuid_1.v4)();
        const subscription = new Subscription_1.Subscription({ email, city, frequency, token, confirmed: false });
        await subscription.save();
        await (0, emailService_1.sendConfirmationEmail)(email, token);
        res.status(200).send('Subscription successful. Confirmation email sent.');
    }
    catch {
        res.status(500).send('Server error');
    }
};
exports.subscribe = subscribe;
const confirmSubscription = async (req, res) => {
    const token = req.params.token;
    const sub = await Subscription_1.Subscription.findOne({ token });
    if (!sub)
        return res.status(404).send('Token not found');
    sub.confirmed = true;
    await sub.save();
    res.status(200).send('Subscription confirmed successfully');
};
exports.confirmSubscription = confirmSubscription;
const unsubscribe = async (req, res) => {
    const token = req.params.token;
    const sub = await Subscription_1.Subscription.findOne({ token });
    if (!sub)
        return res.status(404).send('Token not found');
    await Subscription_1.Subscription.deleteOne({ token });
    res.status(200).send('Unsubscribed successfully');
};
exports.unsubscribe = unsubscribe;
