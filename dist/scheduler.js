"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const scheduler_1 = require("./utils/scheduler");
dotenv_1.default.config();
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Scheduler: MongoDB connected');
    (0, scheduler_1.runScheduler)();
})
    .catch(err => {
    console.error('Scheduler: DB connection error:', err);
    process.exit(1);
});
