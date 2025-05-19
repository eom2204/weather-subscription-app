import { Router, Request, Response } from 'express';
import { subscribe, confirmSubscription, unsubscribe } from '../controllers/subscriptionController';
import { body, param, validationResult } from 'express-validator';

const router = Router();

router.post('/subscribe', [
  body('email').isEmail(),
  body('city').isString().notEmpty(),
  body('frequency').isIn(['hourly', 'daily'])
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  subscribe(req, res);
});

router.get('/confirm/:token', [
  param('token').isString().notEmpty()
], confirmSubscription);

router.get('/unsubscribe/:token', [
  param('token').isString().notEmpty()
], unsubscribe);

export default router;