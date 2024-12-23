import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { ActivityIndicator, View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

const UserProfileCheck = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        // Check if the current user is null
        const currentUser = auth().currentUser;
        
        if (!currentUser) {
          // If no user is signed in, redirect to signIn page
          router.push('../app/signIn');
          return;
        }

        // Get the Firebase ID Token for current user
        const idToken = await currentUser.getIdToken();

        if (idToken) {
          const response = await axios.get('http://localhost:5000/userProfile', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (response.data.setupRequired) {
            router.push('/SetUp'); // Redirect to SetUp if setup is required
          } else {
            router.push('/home'); // Redirect to home if the setup is complete
          }
        } else {
          // If there’s no idToken, redirect to signIn page
          router.push('../app/signIn');
        }
      } catch (err: any) {
        // Set error state to show in the UI
        console.log(`Error checking profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    checkUserProfile();
  }, [router]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return null; // Return nothing, as the component does the redirection
};

export default UserProfileCheck;


