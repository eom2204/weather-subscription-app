import cron from 'node-cron';
import { sendWeatherUpdatesToSubscribers } from '../services/weatherEmailService';

export const runScheduler = () => {
    // Hourly updates (every hour, on the hour)
    cron.schedule('0 * * * *', async () => {
        console.log('Running hourly weather update task');
        await sendWeatherUpdatesToSubscribers('hourly');
    });

    // Daily updates (every day at 8 AM)
    cron.schedule('0 8 * * *', async () => {
        console.log('Running daily weather update task');
        await sendWeatherUpdatesToSubscribers('daily');
    });

    console.log('Weather update scheduler started');
};