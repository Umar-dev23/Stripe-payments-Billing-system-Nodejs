import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as BillingService from './billing.service.js';

export const createSubscriptionCheckout = asyncCatch(async (req, res) => {
  const user = req.user;
  console.log('Authenticated user email:', user);
  const { interval, planId } = req.body;
  const session = await BillingService.createSession(interval, planId, user);
  res.status(200).json({ success: true, url: session.url });
});

export const createCustomerPortalSession = asyncCatch(async (req, res) => {
  const user = req.user;
  console.log('Authenticated user email:', user);
  const portalSession = await BillingService.createCustomerPortalSession(user);
  res.status(200).json({ success: true, url: portalSession.url });
});
