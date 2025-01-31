import GoogleFit, { BucketUnit, Scopes } from "react-native-google-fit";
import {
  StressResult,
  UserProfile,
  ParsedHealthMetrics,
  HealthMetric,
  HourlyStressData,
} from "../types"; // Import the shared type instead of defining it
import { HourlyStressCalculator } from "@/algorithms/stressIndexAlgo";
import apiClient from "@/instances/authInstance";
import { MMKV } from "react-native-mmkv";
import dayjs from "dayjs";

const storage = new MMKV();

// Define the proper options type for Google Fit
interface DateRange {
  startDate: string;
  endDate: string;
}

const options = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_SLEEP_READ,
    Scopes.FITNESS_HEART_RATE_READ,
    Scopes.FITNESS_BODY_READ,
  ],
};

const getStartDate = (endDate: string): string => {
  return dayjs(endDate || undefined)
    .subtract(24, "hours")
    .toISOString();
};

const generateHoursList = (): number[] => {
  return Array.from({ length: 24 }, (_, i) => i);
};

const groupDataByHour = (
  metrics: HealthMetric[],
  targetDate: string
): { [hour: number]: HealthMetric[] } => {
  const hourlyData: { [hour: number]: HealthMetric[] } = {};
  const targetDay = new Date(targetDate).setHours(0, 0, 0, 0);

  generateHoursList().forEach((hour) => {
    hourlyData[hour] = [];
  });

  metrics.forEach((metric) => {
    const metricDate = new Date(metric.timestamp);
    const metricDay = new Date(metricDate).setHours(0, 0, 0, 0);

    if (metricDay === targetDay) {
      const hour = metricDate.getHours();
      hourlyData[hour].push(metric);
    }
  });

  return hourlyData;
};

export const authorizeGoogleFit = async (): Promise<boolean> => {
  try {
    const authResult = await GoogleFit.authorize(options);
    if (authResult.success) {
      console.log("GoogleFit auth success");
    }
    return authResult.success;
  } catch (error) {
    console.error("Authorization error:", error);
    return false;
  }
};

const fetchParsedHealthMetrics = async (
  endDate: string
): Promise<ParsedHealthMetrics> => {
  try {
    const opts: any = {
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      endDate: new Date().toISOString(),
      bucketUnit: BucketUnit.HOUR,
      bucketInterval: 1,
    };

    console.log("Fetching with options:", opts); // Debugging

    const heartRatesTest = await GoogleFit.getHeartRateSamples(opts);
    console.log('Fetched heart rates:', heartRatesTest);

    const [heartRates, sleepData, activityData] = await Promise.all([
      GoogleFit.getHeartRateSamples(opts).catch((err) => {
        console.error("Error fetching heart rates:", err);
        return [];
      }),
      GoogleFit.getSleepSamples(opts, true).catch((err) => {
        console.error("Error fetching sleep data:", err);
        return [];
      }),
      GoogleFit.getDailySteps(opts).catch((err) => {
        console.error("Error fetching activity data:", err);
        return [];
      }),
    ]);

    console.log("Fetched heart rates:", heartRates);
    console.log("Fetched sleep data:", sleepData);
    console.log("Fetched activity data:", activityData);

    const parsedHeartRates = heartRates.map((hr) => ({
      value: hr.value,
      timestamp: new Date(hr.startDate),
    }));

    return {
      heartRates: parsedHeartRates,
      hrvValues: [],
      respiratoryRates: [],
      sleepData: parseSleepData(sleepData),
      activityData: parseActivityData(activityData),
    };
  } catch (error) {
    console.error("Error fetching or parsing health metrics:", error);
    return {
      heartRates: [],
      hrvValues: [],
      respiratoryRates: [],
      sleepData: {},
      activityData: { steps: 0 },
    };
  }
};

export const calculateDailyStress = async (
  profile: UserProfile,
  endDate: string
): Promise<HourlyStressData> => {
  const metrics = await fetchParsedHealthMetrics(endDate);
  const calculator = new HourlyStressCalculator(profile);
  const hourlyResults: HourlyStressData = {};

  console.log("Fetched metrics:", {
    heartRateCount: metrics.heartRates.length,
    timeframe: endDate,
    sleepData: metrics.sleepData,
  });

  const hourlyHeartRates = groupDataByHour(metrics.heartRates, endDate);

  generateHoursList().forEach((hour) => {
    const heartRates = hourlyHeartRates[hour];

    if (heartRates && heartRates.length > 0) {
      try {
        const result = calculator.calculateHourlyStress(
          {
            heartRates,
            hrvValues: [], // We know this is empty
            respiratoryRates: [],
          },
          metrics.sleepData
        );

        hourlyResults[hour] = {
          ...result,
          factors: {
            ...result.factors,
            hrvAvailable: false,
          },
        };
      } catch (error) {
        console.error(`Error calculating stress for hour ${hour}:`, error);
        hourlyResults[hour] = {
          stressIndex: 0,
          stressLevel: "Unknown",
          isElevated: false,
          baselineStress: 0,
          factors: {
            bmiImpact: 0,
            sleepImpact: 0,
            hrvAvailable: false,
          },
          timestamp: new Date(),
        };
      }
    } else {
      hourlyResults[hour] = {
        stressIndex: 0,
        stressLevel: "No Data",
        isElevated: false,
        baselineStress: 0,
        factors: {
          bmiImpact: 0,
          sleepImpact: 0,
          hrvAvailable: false,
        },
        timestamp: new Date(),
      };
    }
  });

  return hourlyResults;
};

const parseSleepData = (
  data: any[]
): { quality?: number; hoursSlept?: number } => {
  if (!data.length) return {};

  const sleepDurations = data.map((entry) => {
    const start = new Date(entry.startDate).getTime();
    const end = new Date(entry.endDate).getTime();
    return (end - start) / (1000 * 60 * 60);
  });

  const totalSleepHours = sleepDurations.reduce((sum, hours) => sum + hours, 0);
  const sleepQuality = calculateSleepQuality(totalSleepHours);

  return {
    hoursSlept: totalSleepHours,
    quality: sleepQuality,
  };
};

export const parseActivityData = (data: any[]): { steps: number } => {
  const totalSteps = data.reduce((sum, entry) => sum + (entry.value || 0), 0);
  return { steps: totalSteps };
};

export const calculateSleepQuality = (hours: number): number => {
  if (hours >= 9) return 5;
  if (hours >= 7) return 4;
  if (hours >= 6) return 3;
  if (hours >= 5) return 2;
  return 1;
};

const GOOGLE_FIT_ENABLED_KEY = "googleFitEnabled";

export const checkAndEnableGoogleFit = async (): Promise<boolean> => {
  try {
    // Step 1: Check if Google Fit is already enabled in the local cache
    const cachedStatus = storage.getBoolean(GOOGLE_FIT_ENABLED_KEY);
    if (cachedStatus) {
      console.log("Google Fit is already enabled (cached).");
      return true;
    }

    // Step 2: Query the server to check if Google Fit is enabled
    const response = await apiClient.get("/users/googleFitStatus");

    if (response.status === 200 && response.data.googleFit) {
      console.log("Google Fit is already enabled (server).");

      // Cache the status in MMKV
      storage.set(GOOGLE_FIT_ENABLED_KEY, true);
      return true;
    }

    // Step 3: If not enabled, send a request to enable it
    const enableResponse = await apiClient.post("/users/googleFit", {
      googleFit: true,
    });

    if (enableResponse.status === 200) {
      console.log("Google Fit enabled successfully:", enableResponse.data);

      // Cache the status in MMKV
      storage.set(GOOGLE_FIT_ENABLED_KEY, true);
      return true;
    } else {
      console.error("Failed to enable Google Fit:", enableResponse.data);
      return false;
    }
  } catch (err: any) {
    console.error("Error checking or enabling Google Fit:", err.message || err);
    return false;
  }
};

export const isGoogleFitEnabled = (): boolean => {
  // Retrieve Google Fit status from MMKV
  return storage.getBoolean(GOOGLE_FIT_ENABLED_KEY) || false;
};
