import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../contexts/LoadingContext";
import { MMKV } from "react-native-mmkv";
import apiClient from "@/instances/authInstance";
import { UserData } from "@/types";

const storage = new MMKV();

const fetchUserData = async (): Promise<UserData | null> => {
  try {
    const response = await apiClient.get("/users/userData");

    if (response.status === 200) {
      return response.data as UserData;
    } else {
      console.error("Failed to fetch user data");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const saveUserDataToStorage = (userData: UserData): void => {
  try {
    storage.set("userProfile", JSON.stringify(userData));
    console.log("User data saved to MMKV");
  } catch (error) {
    console.error("Failed to save user data to MMKV:", error);
  }
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { startLoading, stopLoading } = useContext(LoadingContext);

  useEffect(() => {
    const loadFromStorage = () => {
      const storedData = storage.getString("userProfile");
      if (storedData) {
        setUserData(JSON.parse(storedData) as UserData);
        stopLoading(); // Stop loading if data is found in MMKV
      } else {
        fetchDataFromApi(); // If no data, fetch from API
      }
    };

    const fetchDataFromApi = async () => {
      try {
        startLoading(); // Start loading state
        const fetchedData = await fetchUserData();
        if (fetchedData) {
          setUserData(fetchedData);
          saveUserDataToStorage(fetchedData); // Save data to MMKV
        } else {
          console.error("Failed to fetch user data"); // Log error instead of setting state
        }
      } catch (err) {
        console.error("An error occurred while fetching user data:", err); // Log error
      } finally {
        stopLoading(); // Stop loading when done
      }
    };

    loadFromStorage(); // Attempt to load data on component mount

    return () => stopLoading(); // Cleanup to stop loading if component unmounts
  }, []); 

  return { userData }; // Only return userData since no error state is needed
};
