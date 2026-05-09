import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as PayoutService from './payouts.service.js';
import ApiError from './../../../errors/ApiError.js';

export const connectBanks = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  const onBoardingLink = await PayoutService.createOnboardingLink(accountId);
  res.status(200).json({ success: true, url: onBoardingLink.url });
});

export const getConnectedBanks = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  if (!accountId) {
    return new ApiError(400, 'No Stripe account linked');
  }

  const banks = await PayoutService.getConnectedBanks(accountId);
  res.status(200).json({
    success: true,
    data: banks,
  });
});

export const getWithdrawal = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  const { amount, currency } = req.body;
  if (!accountId) {
    return new ApiError(400, 'No Stripe account linked');
  }

  const withdrawal = await PayoutService.createWithdrawal(accountId, amount, currency);
  res.status(200).json({
    success: true,
    data: withdrawal,
  });
});

export const getWithdrawalHistory = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  if (!accountId) {
    return new ApiError(400, 'No Stripe account linked');
  }
  const history = await PayoutService.getPayoutsHistory(accountId);
  res.status(200).json({
    success: true,
    data: history,
  });
});
