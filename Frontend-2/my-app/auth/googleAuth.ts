import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: "108211950761650651535", 
});

export async function onGoogleButtonPress() {
  try {
    // Check if device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Sign in and get tokens
    await GoogleSignin.signIn();
    const { accessToken } = await GoogleSignin.getTokens();
    
    if (!accessToken) {
      throw new Error("No access token found in sign-in result");
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(accessToken);
    
    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function onGoogleButtonPressLink() {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      // Check if user is signed in to Firebase first
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("No user is currently signed in to Firebase");
      }
  
      // Sign in with Google
      const signInResult = await GoogleSignin.signIn();
      
      // Get both tokens
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      
      if (!idToken) {
        throw new Error("No ID token found in sign-in result");
      }
  
      // Create a Google credential with both tokens
      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);
  
      // Link the Google account to the current Firebase user
      await currentUser.linkWithCredential(googleCredential);
      console.log("Google account linked successfully!");
      
      return currentUser;
    } catch (error: any) {
      // Handle specific Firebase errors
      if (error.code === 'auth/credential-already-in-use') {
        console.error('This Google account is already linked to another Firebase user');
      } else if (error.code === 'auth/provider-already-linked') {
        console.error('A Google account is already linked to this Firebase user');
      }
      
      console.error('Google Account Linking Error:', error);
      throw error;
    }
  }



