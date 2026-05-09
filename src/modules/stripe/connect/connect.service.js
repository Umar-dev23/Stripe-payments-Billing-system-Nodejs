import stripe from '../stripe.config.js';

export const createOnboardingLink = async (accountId) => {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: 'http://localhost:5173',
    return_url: `http://localhost:5173?accountId=${accountId}`,
    type: 'account_onboarding',
    // No "configurations" array needed here!
  });
};

export const getDashboardData = async (accountId) => {
  const [account, balance] = await Promise.all([
    stripe.accounts.retrieve(accountId),
    stripe.balance.retrieve({}, { stripeAccount: accountId }),
  ]);

  const availableBalance = balance.available.reduce((acc, b) => acc + b.amount, 0);
  const pendingBalance = balance.pending.reduce((acc, b) => acc + b.amount, 0);

  // Return only what the frontend actually needs
  const sanitizedAccount = {
    id: account.id,
    businessName: account.business_profile?.name || account.settings?.dashboard?.display_name,
    email: account.email || '',
    payoutsEnabled: account.payouts_enabled,
    chargesEnabled: account.charges_enabled,
    currency: account.default_currency || 'usd',
    availableBalance,
    pendingBalance,
  };
  return sanitizedAccount;
};

export const testPayment = async (vendorAccountId, amount) => {
  const vendorShareRatio = 0.7;
  const transferAmountInCents = Math.round(amount * vendorShareRatio * 100);

  const charge = await stripe.charges.create({
    amount: amount * 100, // Total customer paid in cents
    currency: 'usd',
    source: 'tok_visa', // Test token
    transfer_data: {
      amount: transferAmountInCents,
      destination: vendorAccountId,
    },
  });

  return charge;
};

export const getBalances = async (accountId) => {
  const platformBalance = await stripe.balance.retrieve();

  // Get vendor balance (connected account)
  const vendorBalance = await stripe.balance.retrieve({}, { stripeAccount: accountId });

  // Extract detailed balance information
  const result = {
    platform: {
      available: platformBalance.available,
      pending: platformBalance.pending,
      availableTotal: platformBalance.available.reduce((acc, b) => acc + b.amount, 0),
      pendingTotal: platformBalance.pending.reduce((acc, b) => acc + b.amount, 0),
    },
    vendor: {
      withdrawable: vendorBalance.available,
      nonWithdrawable: vendorBalance.pending,
      withdrawableTotal: vendorBalance.available.reduce((acc, b) => acc + b.amount, 0),
      nonWithdrawableTotal: vendorBalance.pending.reduce((acc, b) => acc + b.amount, 0),
    },
  };

  return result;
};


