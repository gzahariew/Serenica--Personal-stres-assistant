import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';

export default function RootLayout() {
  const [user, setUser] = useState(null); // Track the authenticated user
  const [loading, setLoading] = useState(true); // Track initialization/loading state
  const router = useRouter(); // Expo Router for navigation

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth().onAuthStateChanged((currentUser :any) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Redirect to home if logged in
        router.replace('./home');
      } else {
        // Redirect to sign-in page if not logged in
        router.replace('/signIn/signIn');
      }
    });

    // Clean up the listener on component unmount
    return unsubscribe;
  }, []);

  if (loading) {
    // Optionally, show a loading indicator while Firebase initializes
    return null; // Placeholder for a spinner or splash screen
  }

  return (
    // Render the navigation stack provided by expo-router
    <Stack />
  );
}
