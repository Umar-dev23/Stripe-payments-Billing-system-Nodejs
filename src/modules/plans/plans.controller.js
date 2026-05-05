import * as PlansService from './plans.service.js';
import asyncCatch from './../../utils/asyncCatch.js';

export const getAllPlans = asyncCatch(async (req, res) => {
  const plans = await PlansService.getAllPlans();
  res.status(200).json({ success: true, data: plans });
});
