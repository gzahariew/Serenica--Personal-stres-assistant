import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { ActivityIndicator, View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { LoadingContext, ErrContext } from "../app/index";


const UserProfileCheck = () => {
  const { loading, stopLoading, startLoading } = useContext(LoadingContext);
  const {error, setError} = useContext(ErrContext);
  const router = useRouter();
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
          stopLoading(); // Stop loading if no user
          router.push('../app/signIn');
          return;
        }

        const idToken = await currentUser.getIdToken();

        const response = await axios.get(`${"API_BASE_URL"}/userProfile`, {
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
  }, [router, stopLoading]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <Button title="Retry" onPress={() => window.location.reload()} />
      </View>
    );
  }

  return null; // No UI since redirection is handled
};

export default UserProfileCheck;




