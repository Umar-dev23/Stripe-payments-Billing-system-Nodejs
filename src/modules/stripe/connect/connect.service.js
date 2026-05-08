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
