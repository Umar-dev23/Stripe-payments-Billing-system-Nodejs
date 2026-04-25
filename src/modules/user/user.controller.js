import * as userService from './user.service.js';
import asyncCatch from '../../utils/asyncCatch.js';
import ApiError from '../../errors/ApiError.js';

export const getNearbyUsers = asyncCatch(async (req, res) => {
  const { lng, lat, dist } = req.query;

  if (!lng || !lat) {
    throw new ApiError(400, 'Logitude and Latitude are required.');
  }

  // Call the service
  const radius = dist ? parseInt(dist) : 20000;
  const nearby = await userService.fetchNearbyUsers(lng, lat, radius);

  res.status(200).json({
    success: true,
    count: nearby.length,
    data: nearby,
  });
});
