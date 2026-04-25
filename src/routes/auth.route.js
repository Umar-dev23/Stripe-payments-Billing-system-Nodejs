import express from 'express';
import { login, getProfile, logout, googleAuthRedirect } from '../modules/auth/auth.controller.js';
import passport from 'passport';
import * as authService from '../modules/auth/auth.service.js';

const router = express.Router();

// Public route
router.post('/login', login);

router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile);

router.post('/logout', passport.authenticate('jwt', { session: false }), logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// B. The "Callback" Route: Where Google sends the user back
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173/login',
  }),
  googleAuthRedirect,
);
export default router;
