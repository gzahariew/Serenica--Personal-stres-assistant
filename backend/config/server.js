import express from 'express';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Route to check user profile
app.get('/userProfile', async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the Firebase ID Token
    const decodedToken = await getAuth().verifyIdToken(idToken);

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
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


