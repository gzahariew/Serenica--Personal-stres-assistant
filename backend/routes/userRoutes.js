import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to check user profile
router.get('/userProfile',authenticateUser, getUserProfile);

// Route to make a user profile after set up
router.post('/userSetProfile',authenticateUser,  )

export default router;
