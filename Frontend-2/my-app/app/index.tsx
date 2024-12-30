import React, { useState, useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import UserProfileCheck from "../components/UserProfileCheck";
import IsUserSigned from "../components/IsUserSigned";
import { AppProviders } from "@/contexts/AppProviders";
import { LoadingContext} from "@/contexts/LoadingContext"



export default function Index() {
  const [user, setUser] = useState(null);
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AppProviders>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IsUserSigned />
        <UserProfileCheck />

        <Text>Edit home/index.tsx to edit this screen.</Text>
      </View>
    </AppProviders>
  );
}
