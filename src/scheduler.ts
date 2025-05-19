import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runScheduler } from './utils/scheduler';

dotenv.config();

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('Scheduler: MongoDB connected');
        runScheduler();
    })
    .catch(err => {
        console.error('Scheduler: DB connection error:', err);
        process.exit(1);
    });