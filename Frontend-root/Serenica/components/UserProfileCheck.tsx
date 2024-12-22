import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const UserProfileCheck = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const user = auth().currentUser;

        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (!userDoc.exists) {
            console.log('No document found for the user');
            // No document found for the user, redirect to setup page
            router.push('/SetUp'); // Use router.push for navigation
          } else {
            const userData :any= userDoc.data();
            // Check if the setup is complete by checking specific fields
            if (!userData.isProfileComplete) {
              console.log('Profile is not complete, redirecting to setup');
              router.push('../app/SetUp'); // If setup isn't complete, redirect to setup page
            } else {
              console.log('Profile is complete, redirecting to home');
              router.push('/home'); // If profile is complete, redirect to home page
            }
          }
        } else {
          console.log('User is not logged in');
          // User is not logged in, redirect to login/signup page
          router.push('../app/SetUp');
        }
      } catch (err: any) {
        console.error('Error checking profile:', err);
        throw(`Error checking profile: ${err.message}`);
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

