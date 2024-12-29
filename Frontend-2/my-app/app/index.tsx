import React, { createContext, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import UserProfileCheck from "../components/UserProfileCheck";
import IsUserSigned from "../components/IsUserSigned";

// Define the type for the LoadingContext
interface LoadingContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

// Create the context with default values
export const LoadingContext = createContext<LoadingContextType>({
  loading: true,
  startLoading: () => {},
  stopLoading: () => {},
});

export const UserContext = createContext(null);
export const ErrContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export default function Index() {
  // State to manage loading
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => setLoading(true); // Start loading
  const stopLoading = () => setLoading(false); // Stop loading

  const AppProviders = ({ children }: any) => (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }} >
      <ErrContext.Provider value={{ error, setError }} >
        <UserContext.Provider value={user} >
          {children}
        </UserContext.Provider >
      </ErrContext.Provider >
    </LoadingContext.Provider >
  );

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
