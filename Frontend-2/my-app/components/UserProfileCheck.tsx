import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import {  ErrContext } from "@/contexts/ErrContext";
import { LoadingContext} from "@/contexts/LoadingContext"
import API_BASE_URL from "@/config/apiConfig";


const UserProfileCheck = () => {
  const { loading, stopLoading, startLoading } = useContext(LoadingContext);
  const [trigger, setTrigger] = useState(false);
  const {error, setError} = useContext(ErrContext);
  const router = useRouter();

  useEffect(() => {
    startLoading();
    setTrigger(false)
    const checkUserProfile = async () => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
          stopLoading(); // Stop loading if no user
          router.push('../app/signIn');
          return;
        }

        const idToken = await currentUser.getIdToken(true);

        const response = await axios.get(`${API_BASE_URL}/userProfile`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        router.push(response.data.setupRequired ? '/SetUp' : '/');
      } catch (err: any) {
        console.error(`Error checking profile: ${err.message}`);
        setError('An error occurred while checking your profile. Please try again.');
      } finally {
        stopLoading(); // Stop loading after process finishes
      }
    };

    checkUserProfile();
  }, [router, stopLoading, trigger]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <Button title="Retry" onPress={() => (setTrigger(true))} />
      </View>
    );
  }

  return null; // No UI since redirection is handled
};

export default UserProfileCheck;




