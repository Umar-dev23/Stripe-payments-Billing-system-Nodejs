import express from 'express';
import { createOnboardingLink, getDashboardData, testPayment, getBalances } from './connect.controller.js';
import passport from 'passport';
import { get } from 'http';

const router = express.Router();

router.post('/create-onboardingLink', passport.authenticate('jwt', { session: false }), createOnboardingLink);
router.get('/dashboard', passport.authenticate('jwt', { session: false }), getDashboardData);
router.post('/test-payment', passport.authenticate('jwt', { session: false }), testPayment);
router.get('/balances', passport.authenticate('jwt', { session: false }), getBalances);

export default router;
