import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";

const useAuthState = () => {
  const [initializing, setInitializing] = useState(true); // Track initialization state
  const [user, setUser] = useState<any>(null); // Use `any` or define a proper type for the user

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const subscriber = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update the user state
      if (initializing) setInitializing(false); // Mark initialization as complete
    });

    // Cleanup subscription on unmount
    return () => subscriber();
  }, [initializing]);

  return { user, initializing }; // Return both user and initializing state
};

export default useAuthState;


