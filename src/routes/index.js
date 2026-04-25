import express, { Router } from 'express';

import userRoute from './user.route.js';
import authRoute from './auth.route.js';

const router = express.Router();

const defaultIRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
