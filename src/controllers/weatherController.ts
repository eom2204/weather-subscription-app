import axios from 'axios';
import { Request, Response } from 'express';

export const getWeather = async (req: Request, res: Response) => {
  const city = req.query.city as string;
  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
    const data = response.data;
    res.json({
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      description: data.current.condition.text
    });
  } catch {
    res.status(404).json({ error: 'City not found' });
  }
};
