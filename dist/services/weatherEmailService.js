"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWeatherUpdatesToSubscribers = exports.sendWeatherUpdate = void 0;
const axios_1 = __importDefault(require("axios"));
const Subscription_1 = require("../models/Subscription");
const emailService_1 = require("./emailService");
const sendWeatherUpdate = async (subscription) => {
    try {
        // Fetch weather data for the subscriber's city
        const response = await axios_1.default.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${subscription.city}`);
        const data = response.data;
        const weather = {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            description: data.current.condition.text,
        };
        // Compose email content
        const unsubscribeLink = `${process.env.API_URL}/api/unsubscribe/${subscription.token}`;
        const subject = `Weather Update for ${subscription.city}`;
        const html = `
      <h2>Weather Update for ${subscription.city}</h2>
      <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p><strong>Humidity:</strong> ${weather.humidity}%</p>
      <p><strong>Conditions:</strong> ${weather.description}</p>
      <p>If you no longer wish to receive these emails, <a href="${unsubscribeLink}">unsubscribe here</a>.</p>
    `;
        // Send email with weather update
        await (0, emailService_1.sendEmail)(subscription.email, subject, html);
        console.log(`Weather update sent to ${subscription.email} for ${subscription.city}`);
    }
    catch (error) {
        console.error(`Failed to send weather update to ${subscription.email}:`, error);
    }
};
exports.sendWeatherUpdate = sendWeatherUpdate;
const sendWeatherUpdatesToSubscribers = async (frequency) => {
    try {
        const subscribers = await Subscription_1.Subscription.find({ frequency, confirmed: true });
        console.log(`Sending ${frequency} weather updates to ${subscribers.length} subscribers`);
        for (const subscriber of subscribers) {
            await (0, exports.sendWeatherUpdate)({ email: subscriber.email, city: subscriber.city, token: subscriber.token });
        }
    }
    catch (error) {
        console.error(`Error processing ${frequency} weather updates:`, error);
    }
};
exports.sendWeatherUpdatesToSubscribers = sendWeatherUpdatesToSubscribers;
