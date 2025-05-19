import { Router, Request, Response } from 'express';
import { getWeather } from '../controllers/weatherController';
import { query, validationResult } from 'express-validator';

const router = Router();

router.get('/weather', [
  query('city').isString().notEmpty()
], (req: Request, res: Response) => {
  const errors = validationResult(req)  ;
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  getWeather(req, res);
});

export default router;