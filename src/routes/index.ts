import { Router } from 'express';
import weatherRoutes from './weather';
import subscriptionRoutes from './subscription';

const router = Router();
router.use('/', weatherRoutes);
router.use('/', subscriptionRoutes);

export default router;
