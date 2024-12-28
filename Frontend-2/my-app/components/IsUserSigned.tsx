import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';

const IsUserSigned = () => {
  const [initializing, setInitializing] = useState(true); // Block rendering until Firebase connects
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Handle user state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((currentUser:any) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    return subscriber; // Unsubscribe on unmount
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  // Redirect logic

    if (!user) {
      router.replace('/signIn/signIn'); // Redirect to Home if authenticated
    } 


  // While redirection is happening, return an empty view
  return null;
};

export default IsUserSigned;
