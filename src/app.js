import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import './modules/auth/passport.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { webHoookListener } from './modules/stripe/webhooks/webhook.handler.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Stripe Webhook MUST come before express.json()
app.post('/api/stripe/webhooks', express.raw({ type: 'application/json' }), webHoookListener);

app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api', routes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
