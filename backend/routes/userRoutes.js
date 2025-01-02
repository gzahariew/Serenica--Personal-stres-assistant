// /routes/userRoutes.js
import express from 'express';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Route to check user profile
router.get('/userProfile', getUserProfile);

export default router;
