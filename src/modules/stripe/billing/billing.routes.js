import express from 'express';
import { createSubscriptionCheckout, createCustomerPortalSession } from './billing.controller.js';
import passport from 'passport';

const router = express.Router();

router.post('/create-subscription-checkout', passport.authenticate('jwt', { session: false }), createSubscriptionCheckout);
router.post(
  '/create-customer-portal-session',
  passport.authenticate('jwt', { session: false }),
  createCustomerPortalSession,
);

export default router;
