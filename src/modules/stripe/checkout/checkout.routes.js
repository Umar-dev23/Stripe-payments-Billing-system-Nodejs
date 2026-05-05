import express from 'express';
import { createCheckcoutSession, dynamicCheckoutSession } from './checkout.controller.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckcoutSession);
router.post('/dynamic-checkout-session', dynamicCheckoutSession);

export default router;
