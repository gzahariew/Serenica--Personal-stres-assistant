import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import {LoadingContext} from "../app/index"

const IsUserSigned = () => {
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);

  const [initializing, setInitializing] = useState(true); // Block rendering until Firebase connects
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Handle user state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((currentUser:any) => {
      setUser(currentUser);
      if (loading) stopLoading();
    });

    return subscriber; // Unsubscribe on unmount
  }, [loading]);

  // Redirect logic

    if (!user) {
      router.replace('/signIn/signIn'); // Redirect to Home if authenticated
    } 


  // While redirection is happening, return an empty view
  return null;
};

export default IsUserSigned;
