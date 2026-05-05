import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as BillingService from './billing.service.js';

export const createSubscriptionCheckout = asyncCatch(async (req, res) => {
  const { priceId } = req.body;

  const session = await BillingService.createSession(priceId);
  console.log(session)
  res.status(200).json({ success: true, url: session.url });
});
