import express from 'express';
import { getAllPlans } from './plans.controller.js';

const router = express.Router();

router.get('/get-plans', getAllPlans);

export default router;
