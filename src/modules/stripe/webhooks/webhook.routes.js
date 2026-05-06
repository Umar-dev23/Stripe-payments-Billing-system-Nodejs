import express from 'express';
import { getallWebhooks } from './webhook.controller.js';

const router = express.Router();

router.get('/get-all', getallWebhooks);

export default router;
