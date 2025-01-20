export interface StressResult {
  stressIndex: number;
  stressLevel: string;
  isElevated: boolean;
  baselineStress: number;
  factors: {
    bmiImpact: number;
    sleepImpact: number;
    hrvAvailable: boolean;
  };
  timestamp: Date;
}

export interface UserProfile {
  age: number;
  gender: string;
  bmi: number;
}

export interface ParsedHealthMetrics {
  heartRates: HealthMetric[];
  hrvValues: HealthMetric[];
  respiratoryRates: HealthMetric[];
  sleepData: {
    quality?: number;
    hoursSlept?: number;
  };
  activityData: {
    steps: number;
  };
}

export interface HealthMetric {
  value: number;
  timestamp: Date;
}

export interface HourlyStressData {
  [hour: number]: StressResult | null;
}

export interface UserData {
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  sleep: string;
  gender: string;
  preferences: {
    activity: boolean;
    deepBreathing: boolean;
    meditation: boolean;
    other: boolean;
    socialInteraction: boolean;
    walk: boolean;
  };
}
