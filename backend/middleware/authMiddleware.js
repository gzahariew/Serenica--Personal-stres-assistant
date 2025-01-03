import { firebaseAuth } from '../config/firebaseAdmin.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the Firebase ID Token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    if (decodedToken) {
      req.user = decodedToken; // Attach the decoded token to the request object
      next(); // Pass control to the next handler
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

