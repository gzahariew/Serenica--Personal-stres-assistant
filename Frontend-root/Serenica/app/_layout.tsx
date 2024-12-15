// /app/layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { getAuth } from "firebase/auth";

const auth = getAuth();

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser :any) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        router.replace('/home'); // Redirect to home if logged in
      } else {
        router.replace('./signIn'); // Redirect to sign-in if not logged in
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show a loading screen while checking auth
    return null;
  }

  return <Stack />;
}
