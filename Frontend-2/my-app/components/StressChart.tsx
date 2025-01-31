import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { calculateDailyStress } from "@/wearableApis/googleFit";
import { HourlyStressData, UserProfile } from "../types";
import { useGoogleFit } from "../contexts/GoogleFitContext";

interface StressChartProps {
  userProfile: UserProfile;
  onError?: (error: string) => void;
}

export const StressChart: React.FC<StressChartProps> = ({
  userProfile,
  onError,
}) => {
  const {
    isAuthorized,
    isLoading: isAuthLoading,
    error: authError,
    authorize,
  } = useGoogleFit();
  const [stressData, setStressData] = useState<HourlyStressData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isAuthorized) return;

    try {
      setIsLoading(true);
      const endDate = new Date().toISOString();
      console.log("Chart endDate",endDate);
      const data = await calculateDailyStress(userProfile, endDate);
      console.log("Fetched stress data:", data); // Log fetched data
      setStressData(data);
      console.log("Updated stressData state:", data); // Log updated state
      setError(null);
    } catch (err) {
      const errorMessage = "Failed to fetch stress data";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
      fetchData();
    }
  }, [isAuthorized, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading stress data...</Text>
      </View>
    );
  }

  if (!isAuthorized) {
    return (
      <View style={styles.container}>
        <Text style={styles.messageText}>Google Fit access required</Text>
        <Pressable style={styles.button} onPress={authorize}>
          <Text style={styles.buttonText}>Connect Google Fit</Text>
        </Pressable>
      </View>
    );
  }

  if (authError || error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{authError || error}</Text>
        <Pressable style={styles.button} onPress={fetchData}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        data: Array.from({ length: 24 }, (_, i) => {
          const hourData = stressData[i];
          // console.log(`Hour ${i} data:`, hourData);
          // Always return a number, even if it's 0
          return hourData?.stressIndex || 0;
        }),
      },
    ],
  };

  console.log("Chart data:", chartData); // Log chart data

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Daily Stress Levels</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          strokeWidth: 2,
          decimalPlaces: 1,
        }}
        bezier
        style={styles.chart}
      />
      <Pressable style={styles.button} onPress={fetchData}>
        <Text style={styles.buttonText}>Refresh</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    minHeight: 200,
  },
  chartContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  messageText: {
    marginBottom: 16,
    textAlign: "center",
  },
});

export default StressChart;
