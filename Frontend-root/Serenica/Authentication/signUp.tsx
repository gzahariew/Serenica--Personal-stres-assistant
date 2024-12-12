
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { app } from '../firebaseConfig';  // assuming firebaseConfig.js is exporting app

export const signUp = async (email: string, password: string): Promise<void> => {
  try {
    const auth = getAuth(app);  // Get the auth instance from your app initialization
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      await sendEmailVerification(user);  // Send verification email
      console.log('Verification email sent!');
    }
  } catch (error: any) {
    console.error('Error signing up:', error.message);
  }
};

