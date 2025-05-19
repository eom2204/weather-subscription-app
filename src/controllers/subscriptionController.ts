import { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { v4 as uuidv4 } from 'uuid';
import { sendConfirmationEmail } from '../services/emailService';

export const subscribe = async (req: Request, res: Response) => {
  const { email, city, frequency } = req.body;
  try {
    const existing = await Subscription.findOne({ email });

    if (existing) return res.status(409).send('Email already subscribed');

    const token = uuidv4();

    const subscription = new Subscription({ email, city, frequency, token, confirmed: false });
    await subscription.save();

    await sendConfirmationEmail(email, token);

    res.status(200).send('Subscription successful. Confirmation email sent.');
  } catch {
    res.status(500).send('Server error');
  }
};

export const confirmSubscription = async (req: Request, res: Response) => {
  const token = req.params.token;
  const sub = await Subscription.findOne({ token });
  if (!sub) return res.status(404).send('Token not found');
  sub.confirmed = true;
  await sub.save();
  res.status(200).send('Subscription confirmed successfully');
};

export const unsubscribe = async (req: Request, res: Response) => {
  const token = req.params.token;
  const sub = await Subscription.findOne({ token });
  if (!sub) return res.status(404).send('Token not found');
  await Subscription.deleteOne({ token });
  res.status(200).send('Unsubscribed successfully');
};
