import express from 'express';
import { connectBanks, getConnectedBanks, getWithdrawal, getWithdrawalHistory } from './payouts.controller.js';
import passport from 'passport';
import { get } from 'http';

const router = express.Router();

router.post('/connect-bank', passport.authenticate('jwt', { session: false }), connectBanks);
router.get('/get-banks', passport.authenticate('jwt', { session: false }), getConnectedBanks);
router.post('/withdraw', passport.authenticate('jwt', { session: false }), getWithdrawal);
router.get('/withdrawal-history', passport.authenticate('jwt', { session: false }), getWithdrawalHistory);

export default router;
