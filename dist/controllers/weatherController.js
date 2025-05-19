"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const getWeather = async (req, res) => {
    const city = req.query.city;
    try {
        const response = await axios_1.default.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
        const data = response.data;
        res.json({
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text
        });
    }
    catch {
        res.status(404).json({ error: 'City not found' });
    }
};
exports.getWeather = getWeather;
