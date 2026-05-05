import express, { Router } from 'express';

import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import checkoutRoute from './../modules/stripe/checkout/checkout.routes.js';
import intentRoute from './../modules/stripe/intents/intent.route.js';
import billingRoute from './../modules/stripe/billing/billing.routes.js';

const router = express.Router();
const stripeSubRouter = express.Router();

const StripeRoutes = [
  {
    path: '/checkout',
    route: checkoutRoute,
  },
  {
    path: '/intents',
    route: intentRoute,
  },
  {
    path: '/billing',
    route: billingRoute,
  },
];

StripeRoutes.forEach((route) => {
  stripeSubRouter.use(route.path, route.route);
});

const defaultIRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/stripe',
    route: stripeSubRouter,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
