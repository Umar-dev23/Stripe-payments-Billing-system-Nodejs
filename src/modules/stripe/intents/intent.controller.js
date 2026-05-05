import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as IntentService from './intent.service.js';

export const createStripeIntent = asyncCatch(async (req, res) => {
  const lineItems = req.body;
  const stripeIntent = await IntentService.createIntent(lineItems);
  res.status(200).json({ success: true, clientSecret: stripeIntent.client_secret });
});
