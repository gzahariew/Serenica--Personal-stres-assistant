import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { ActivityIndicator, View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

const UserProfileCheck = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
          router.push('../app/signIn');
          return;
        }

        const idToken = await currentUser.getIdToken();

        const response = await axios.get(`${process.env.API_BASE_URL}/userProfile`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        router.push(response.data.setupRequired ? '/SetUp' : '/');
      } catch (err :any) {
        console.error(`Error checking profile: ${err.message}`);
        setError('An error occurred while checking your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkUserProfile();
  }, [router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return null; // No UI since redirection is handled
};

export default UserProfileCheck;



