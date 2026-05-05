import express from 'express';
import { createStripeIntent } from './intent.controller.js';

const router = express.Router();

router.post('/create-intent', createStripeIntent);

export default router;
