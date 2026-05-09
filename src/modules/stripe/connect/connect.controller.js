import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as ConnectService from './connect.service.js';
import ApiError from './../../../errors/ApiError.js';

export const createOnboardingLink = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  const onBoardingLink = await ConnectService.createOnboardingLink(accountId);
  res.status(200).json({ success: true, url: onBoardingLink.url });
});

export const getDashboardData = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  if (!accountId) {
    return res.status(200).json({ success: true, account: null });
  }
  const dashboardData = await ConnectService.getDashboardData(accountId);
  res.status(200).json({
    success: true,
    account: dashboardData,
  });
});

export const testPayment = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  const data = req.body;
  if (!accountId) {
    return new ApiError(400, 'No Stripe account linked');
  }
  const charge = await ConnectService.testPayment(accountId, data.productPrice);

  res.status(200).json({ success: true, charge });
});

export const getBalances = asyncCatch(async (req, res) => {
  const accountId = req.user.stripeAccountId;
  if (!accountId) {
    return new ApiError(400, 'No Stripe account linked');
  }
  const balances = await ConnectService.getBalances(accountId);
  res.status(200).json({ success: true, data: balances });
});
