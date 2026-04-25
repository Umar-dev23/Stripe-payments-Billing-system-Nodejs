import { User } from './user.model.js';
import asyncCatch from '../../utils/asyncCatch.js';

export const fetchNearbyUsers = async (lng, lat, distanceInMeters = 20000) => {
  // Logic lives here
  return await User.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: distanceInMeters,
      },
    },
  });
};
