// /controllers/userController.js
import { db, firebaseAuth } from '../config/firebaseAdmin.js';

export const getUserProfile = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the Firebase ID Token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    if (decodedToken) {
      const userId = decodedToken.uid;
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return res.status(200).json({ setupRequired: true });
      }

      const userData = userDoc.data();
      if (!userData.isProfileComplete) {
        return res.status(200).json({ setupRequired: true });
      } else {
        return res.status(200).json({ setupRequired: false });
      }
    }
  } catch (error) {
    console.error('Error verifying token or accessing Firestore:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
