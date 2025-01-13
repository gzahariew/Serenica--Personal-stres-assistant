import GoogleFit, { Scopes } from "react-native-google-fit";
import {
  StressResult,
  UserProfile,
  ParsedHealthMetrics,
  HealthMetric,
  HourlyStressData,
} from "../types"; // Import the shared type instead of defining it
import { HourlyStressCalculator } from "@/algorithms/stressIndexAlgo";
import apiClient from "@/instances/authInstance";
import googleFit from "react-native-google-fit";

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
  const end = new Date(endDate);
  const start = new Date(end);
  start.setHours(end.getHours() - 24);
  return start.toISOString();
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
    return authResult.success;
  } catch (error) {
    console.error("Authorization error:", error);
    return false;
  }
};

export const fetchParsedHealthMetrics = async (
  endDate: string
): Promise<ParsedHealthMetrics> => {
  try {
    const startDate = getStartDate(endDate);

    // Convert dates to timestamps for Google Fit API
    const startTimestamp = new Date(startDate).valueOf();
    const endTimestamp = new Date(endDate).valueOf();

    const [heartRates, sleepData, activityData] = await Promise.all([
      GoogleFit.getHeartRateSamples({
        startDate: startTimestamp,
        endDate: endTimestamp,
      } as any).catch(() => []),
      GoogleFit.getSleepSamples(
        {
          startDate: startTimestamp,
          endDate: endTimestamp,
        } as any,
        true
      ).catch(() => []),
      GoogleFit.getDailySteps({
        startDate: startTimestamp,
        endDate: endTimestamp,
      } as any).catch(() => []),
    ]);

    const parsedHeartRates = heartRates.map((hr) => ({
      value: hr.value,
      timestamp: new Date(hr.startDate),
    }));

    const parsedSleepData = parseSleepData(sleepData);
    const parsedActivityData = parseActivityData(activityData);

    return {
      heartRates: parsedHeartRates,
      hrvValues: [],
      respiratoryRates: [],
      sleepData: parsedSleepData,
      activityData: parsedActivityData,
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

  const hourlyHeartRates = groupDataByHour(metrics.heartRates, endDate);

  generateHoursList().forEach((hour) => {
    const heartRates = hourlyHeartRates[hour];

    if (heartRates.length > 0) {
      const hourlyData = {
        heartRates,
        hrvValues: [],
        respiratoryRates: [],
      };

      try {
        // Use proper typing for StressResult
        const result = calculator.calculateHourlyStress(
          hourlyData,
          metrics.sleepData
        );

        // Ensure the result has all required properties
        hourlyResults[hour] = {
          ...result,
          factors: {
            ...result.factors,
            hrvAvailable: false, // Add the missing property
          },
        };
      } catch (error) {
        console.error(`Error calculating stress for hour ${hour}:`, error);
        hourlyResults[hour] = null;
      }
    } else {
      hourlyResults[hour] = null;
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

export const enableGoogleFit = async (): Promise<void> => {
  try {
    const response = await apiClient.post('/users/googleFit', { googleFit: true });
    
    // Check if the response is successful before logging
    if (response.status === 200) {
      console.log('Google Fit enabled successfully:', response.data);
    } else {
      console.error('Failed to enable Google Fit:', response.data);
    }
  } catch (err: any) {
    console.error('Error enabling Google Fit:', err.message || err);
  }
};
