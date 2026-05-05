import express from 'express';
import { createSubscriptionCheckout } from './billing.controller.js';

const router = express.Router();

router.post('/create-subscription-checkout', createSubscriptionCheckout);

export default router;
