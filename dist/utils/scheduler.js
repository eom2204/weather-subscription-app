"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const weatherEmailService_1 = require("../services/weatherEmailService");
const runScheduler = () => {
    // Hourly updates (every hour, on the hour)
    node_cron_1.default.schedule('59 * * * * *', async () => {
        console.log('Running hourly weather update task');
        await (0, weatherEmailService_1.sendWeatherUpdatesToSubscribers)('hourly');
    });
    // Daily updates (every day at 8 AM)
    node_cron_1.default.schedule('0 8 * * *', async () => {
        console.log('Running daily weather update task');
        await (0, weatherEmailService_1.sendWeatherUpdatesToSubscribers)('daily');
    });
    console.log('Weather update scheduler started');
};
exports.runScheduler = runScheduler;
