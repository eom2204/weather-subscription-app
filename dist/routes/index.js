"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weather_1 = __importDefault(require("./weather"));
const subscription_1 = __importDefault(require("./subscription"));
const router = (0, express_1.Router)();
router.use('/', weather_1.default);
router.use('/', subscription_1.default);
exports.default = router;
