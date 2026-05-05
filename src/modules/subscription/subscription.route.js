import express from 'express';
import { getMySubscription } from './subscription.controller.js';
import passport from 'passport';

const router = express.Router();

router.get('/get-my-subscription', passport.authenticate('jwt', { session: false }), getMySubscription);

export default router;
