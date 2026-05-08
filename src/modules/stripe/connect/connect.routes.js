import express from 'express';
import { createOnboardingLink, getDashboardData } from './connect.controller.js';
import passport from 'passport';
import { get } from 'http';

const router = express.Router();

router.post('/create-onboardingLink', passport.authenticate('jwt', { session: false }), createOnboardingLink);
router.get('/dashboard', passport.authenticate('jwt', { session: false }), getDashboardData);

export default router;
