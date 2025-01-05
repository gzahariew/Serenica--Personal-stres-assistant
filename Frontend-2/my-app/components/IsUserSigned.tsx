import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { LoadingContext } from "@/contexts/LoadingContext";

const IsUserSigned = () => {
  const { loading, startLoading, stopLoading } = useContext(LoadingContext);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false); // Track mounting status
  const router = useRouter();

  useEffect(() => {
    startLoading();

    const subscriber = auth().onAuthStateChanged((currentUser: any) => {
      setUser(currentUser);
      stopLoading();
    });

    return () => subscriber(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!loading && !user) {
      router.replace("/signIn/signIn"); // Navigate only if mounted
    }
  }, []);

  useEffect(() => {
    setIsMounted(true); // Ensure this runs after the component is mounted
    return () => setIsMounted(false); // Cleanup on unmount
  }, []);

  return null; // Render nothing while checking auth state
};

export default IsUserSigned;


