import axios from 'axios';
import { Subscription } from '../models/Subscription';
import { sendEmail } from './emailService';
import {unsubscribe} from "../controllers/subscriptionController";

interface WeatherData {
    temperature: number;
    humidity: number;
    description: string;
}

export const sendWeatherUpdate = async (subscription: { email: string; city: string; token: string }) => {
    try {
        // Fetch weather data for the subscriber's city
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${subscription.city}`);
        const data = response.data;
        const weather: WeatherData = {
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
        await sendEmail(subscription.email, subject, html);
        console.log(`Weather update sent to ${subscription.email} for ${subscription.city}`);
    } catch (error) {
        console.error(`Failed to send weather update to ${subscription.email}:`, error);
    }
};

export const sendWeatherUpdatesToSubscribers = async (frequency: 'hourly' | 'daily') => {
    try {
        const subscribers = await Subscription.find({ frequency, confirmed: true });
        console.log(`Sending ${frequency} weather updates to ${subscribers.length} subscribers`);

        for (const subscriber of subscribers) {
            await sendWeatherUpdate({ email: subscriber.email, city: subscriber.city, token: subscriber.token });
        }
    } catch (error) {
        console.error(`Error processing ${frequency} weather updates:`, error);
    }
};