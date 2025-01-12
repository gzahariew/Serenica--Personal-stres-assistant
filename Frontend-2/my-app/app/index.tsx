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
import IsUserSigned from "../components/IsUserSigned";
import { AppProviders } from "@/contexts/AppProviders";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "expo-router";

//TODO add the google fit with the algorithm via custom hook 

function MainContent() {
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);
  // const [stressData, setStressData] = useState<StressData[]>([]);
  const router = useRouter();

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"))
      .then(() => router.push("/signIn/signIn"));
  };

  useEffect(() => {
    const checkProfile = async () => {
      try {
        startLoading();
        const isValid = await checkUserProfile(router);
        if (isValid) {
          console.log("Profile is valid");
        } else {
          console.log("Error occurred, redirecting or handling");
        }
      } catch (error) {
        console.error("Error checking profile gain:", error);
      } finally {
        stopLoading();
      }
    };

    checkProfile();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <IsUserSigned />
      <Text>Edit home/index.tsx to edit this screen.</Text>
      <Button title="Log out" onPress={signOut}></Button>
    </View>
  );
}

// Main component that includes the providers
export default function Index() {
  return (
    <AppProviders>
      <MainContent />
    </AppProviders>
  );
}

