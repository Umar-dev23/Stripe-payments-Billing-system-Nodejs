import Plans from './plans.model.js';

export const getAllPlans = async () => {
  const plans = await Plans.find({});
  return plans;
};
