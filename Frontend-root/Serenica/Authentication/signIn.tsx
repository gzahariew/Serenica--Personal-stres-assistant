import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const signIn = async (email:any, password:any) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
  } catch (error) {
    console.error("Error signing in:", error.message);
  }
};
