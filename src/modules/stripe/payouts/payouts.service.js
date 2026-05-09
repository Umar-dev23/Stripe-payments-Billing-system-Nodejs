import stripe from '../stripe.config.js';

export const getConnectedBanks = async (accountId) => {
  const banks = await stripe.accounts.listExternalAccounts(accountId, {
    object: 'bank_account',
  });
  //   console.log('Banks:', banks);
  const formattedBanks = banks.data.map((bank) => ({
    id: bank.id,
    bankName: bank.bank_name,
    last4: bank.last4,
    currency: bank.currency,
    status: bank.status,
  }));
  return formattedBanks;
};

export const createWithdrawal = async (accountId, amount, currency) => {
  const payout = await stripe.payouts.create(
    {
      amount: amount * 100, // Convert to cents
      currency: currency,
    },
    { stripeAccount: accountId },
  );
  return payout;
};


export const getPayoutsHistory = async (accountId) => {
  const payouts = await stripe.payouts.list({ limit: 100 }, { stripeAccount: accountId });
  return payouts.data;
};