import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { createProfile } from '../controllers/createProfile.js';
import { checkIfEnabledGoogleFit, enableGoogleFit } from '../controllers/googleApiController.js';

const router = express.Router();

// Route to check user profile
router.get('/userProfile',authenticateUser, getUserProfile);

// Route to make a user profile after set up
router.post('/userSetProfile',authenticateUser, createProfile);

router.post('/googleFit',authenticateUser, enableGoogleFit);

router.get('googleFitStatus', authenticateUser, checkIfEnabledGoogleFit);

export default router;
