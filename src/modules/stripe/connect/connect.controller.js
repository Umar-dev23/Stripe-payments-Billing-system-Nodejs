import stripe from '../stripe.config.js';
import asyncCatch from './../../../utils/asyncCatch.js';
import * as ConnectService from './connect.service.js';

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

  // Fetch both Account details and Balance in parallel
  const [account, balance] = await Promise.all([
    stripe.accounts.retrieve(accountId),
    stripe.balance.retrieve({}, { stripeAccount: accountId }),
  ]);
  

  // Extract total available and pending amounts
  const availableBalance = balance.available.reduce((acc, b) => acc + b.amount, 0);
  const pendingBalance = balance.pending.reduce((acc, b) => acc + b.amount, 0);

  // Return only what the frontend actually needs
  const sanitizedAccount = {
    id: account.id,
    businessName: account.business_profile?.name || account.settings?.dashboard?.display_name,
    email: account.email || req.user.email,
    payoutsEnabled: account.payouts_enabled,
    chargesEnabled: account.charges_enabled,
    currency: account.default_currency || 'usd',
    availableBalance,
    pendingBalance,
  };

  res.status(200).json({
    success: true,
    account: sanitizedAccount,
  });
});
