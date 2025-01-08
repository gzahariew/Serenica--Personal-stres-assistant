import React, { useState, useContext, useEffect } from "react";
import { View, Text, ActivityIndicator, Button, FlatList, StyleSheet } from "react-native";
import checkUserProfile from "../components/UserProfileCheck";
import auth from "@react-native-firebase/auth";
import IsUserSigned from "../components/IsUserSigned";
import { AppProviders } from "@/contexts/AppProviders";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "expo-router";
import { StressDataGenerator } from "@/algorithms/stressDataGenerator";

interface StressData {
  timestamp: number;
  heartRate: number;
  hrvMs: number;
  respiratoryRate: number;
  sleepQuality: string;
  hoursSlept: number;
  calculatedStress: {
    stressLevel: string;
    stressIndex: number;
  };
}

function MainContent() {
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);
  const [stressData, setStressData] = useState<StressData[]>([]);
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

  // Generate the data on initial load
  useEffect(() => {
    const generator = new StressDataGenerator();
    const data :any = generator.generateTimeSeriesData(24, 5); // Generate data for 24 hours, 5-minute intervals
    setStressData(data);
    stopLoading();
  }, []);

  // Function to display a sample of the generated data (e.g., on button click)
  const handleExportData = () => {
    console.log("Exported data: ", stressData);
    // Here you can add logic to export the data to a file or elsewhere
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
       {/* <FlatList
          data={stressData}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
              <Text>Heart Rate: {item.heartRate} bpm</Text>
              <Text>HRV: {item.hrvMs} ms</Text>
              <Text>Respiratory Rate: {item.respiratoryRate} breaths/min</Text>
              <Text>Sleep Quality: {item.sleepQuality}</Text>
              <Text>Hours Slept: {item.hoursSlept}</Text>
              <Text>Calculated Stress Level: {item.calculatedStress.stressLevel}</Text>
              <Text>Stress Index: {item.calculatedStress.stressIndex}</Text>
            </View>
          )}
        /> */}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
});
