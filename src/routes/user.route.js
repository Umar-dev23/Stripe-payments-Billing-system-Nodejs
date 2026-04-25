import express from 'express';
import { getNearbyUsers } from '../modules/user/user.controller.js';
import e from 'express';

const router = express.Router();
router.get('/nearby', getNearbyUsers);

export default router;
