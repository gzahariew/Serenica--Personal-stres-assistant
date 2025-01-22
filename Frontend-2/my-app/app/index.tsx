import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import checkUserProfile from "../components/UserProfileCheck";
import auth from "@react-native-firebase/auth";
import useAuthState from "@/hooks/useAuthState"; // Import the custom hook
import { AppProviders } from "@/contexts/AppProviders";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "expo-router";
import { onGoogleButtonPressLink } from "@/auth/googleAuth";
import { GoogleFitProvider } from "../contexts/GoogleFitContext";
import  StressChart  from "@/components/StressChart";
import { useUserData } from "@/hooks/getUserProfile";
import { UserProfile } from "@/types";

function MainContent() {
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);
  const router = useRouter();
  const { user, initializing } = useAuthState();
  const { userData } = useUserData();
  const [bmi, setBmi] = useState<number>();

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"))
      .then(() => router.push("/signIn/signIn"));
  };

  const calculateBMI = () => {
    if (!userData || !userData.height || !userData.weight) {
      console.warn("Cannot calculate BMI: missing height or weight.");
      return;
    }
    const heightInMeters: number = userData.height / 100;
    const bmiValue: number = userData.weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue);
  };

  useEffect(() => {
    const checkProfile = async () => {
      try {
        startLoading();
        if (userData && userData.height && userData.weight) {
          calculateBMI();
          const isValid = await checkUserProfile(router);
          if (isValid) {
            console.log("Profile is valid");
          } else {
            console.log("Error occurred, redirecting or handling");
          }
        } else {
          console.warn("User data is not available. Skipping BMI calculation.");
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      } finally {
        stopLoading();
      }
    };
  
    if (userData) {
      checkProfile();
    }
  }, [userData]); // Re-run when userData changes
  

  const userProfile: UserProfile = {
    age:  25, // Default to 25 if undefined
    gender:  "male", // Default to "male" if undefined
    bmi: 23, // Use the calculated BMI or default to 23
  };

  if (loading || initializing ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: 550 }}>
      <Text>Edit home/index.tsx to edit this screen.</Text>
      <Button title="Log out" onPress={signOut}></Button>
      {userData ? (
        <View style={styles.userDataContainer}>
          <Text style={styles.userDataText}>Name: {userData.name}</Text>
          <Text style={styles.userDataText}>Email: {userData.email}</Text>
          <Text style={styles.userDataText}>Height: {userData.height}</Text>
          {/* Add more fields as needed */}
        </View>
      ) : (
        <Text style={styles.userDataText}>User data is not available.</Text>
      )}
      <StressChart userProfile={userProfile} />
      <Button
        title="Link google fit"
        onPress={onGoogleButtonPressLink}
      ></Button>
    </View>
  );
}

// Main component that includes the providers
export default function Index() {
  return (
    <AppProviders>
      <GoogleFitProvider>
        <MainContent />
      </GoogleFitProvider>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  userDataContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  userDataText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
