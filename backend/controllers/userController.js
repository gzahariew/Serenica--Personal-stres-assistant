import { db } from '../config/firebaseAdmin.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid; // The decoded token is now available in req.user
    const userDoc = await db.collection('users').doc(userId).get();


    if (!userDoc.exists) {
      return res.status(200).json({ setupRequired: true });
    }

    // If the document exists, the profile setup is complete
    return res.status(200).json({ setupRequired: false });
    
  } catch (error) {
    console.error('Error accessing Firestore:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
};

