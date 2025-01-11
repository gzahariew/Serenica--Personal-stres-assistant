interface UserProfile {
  age: number;
  gender: string;
  bmi: number;
}

interface HealthMetric {
  value: number;
  timestamp: Date;
}

interface HourlyData {
  heartRates: HealthMetric[];
  hrvValues: HealthMetric[];
  respiratoryRates: HealthMetric[];
}

interface StressData {
  heartRate: number;
  hrvMs: number;
  respiratoryRate?: number;
  sleepQuality?: number;
  hoursSlept?: number;
}

interface StressResult {
  stressIndex: number;
  stressLevel: string;
  isElevated: boolean;
  baselineStress: number;
  factors: {
    bmiImpact: number;
    sleepImpact: number;
  };
  timestamp: Date;
}

interface HourlyStressResult {
  [hour: string]: StressResult;
}

const Gender = {
  MALE: "male",
  FEMALE: "female",
} as const;

const SleepQuality = {
  VERY_GOOD: 5,
  GOOD: 4,
  NEUTRAL: 3,
  BAD: 2,
  VERY_BAD: 1,
} as const;

export class HourlyStressCalculator {
  private profile: UserProfile;
  private lastStressValue: number | null;
  private expectedHrv!: number;
  private hrvRange!: number;

  constructor(userProfile: UserProfile) {
    this.validateProfile(userProfile);
    this.profile = userProfile;
    this.lastStressValue = null;
    this.setAgeBasedRanges();
  }

  private validateProfile(profile: UserProfile): void {
    const required = ["age", "gender", "bmi"] as const;
    required.forEach((field) => {
      if (!(field in profile)) {
        throw new Error(`Missing required profile field: ${field}`);
      }
    });

    if (profile.age < 18 || profile.age > 100) {
      throw new Error("Age must be between 18 and 100");
    }
    if (profile.bmi < 10 || profile.bmi > 50) {
      throw new Error("BMI must be between 10 and 50");
    }
  }

  private setAgeBasedRanges(): void {
    const age = this.profile.age;
    let baseHrv =
      age < 30 ? 100 : age < 40 ? 85 : age < 50 ? 70 : age < 60 ? 55 : 40;

    if (this.profile.gender === Gender.FEMALE) {
      baseHrv *= 0.9;
    }

    this.expectedHrv = baseHrv;
    this.hrvRange = baseHrv * 0.5;
  }

  private calculateBmiImpact(): number {
    const bmi = this.profile.bmi;
    if (bmi < 18.5) return 0.15;
    if (bmi < 25) return 0;
    if (bmi < 30) return 0.15;
    if (bmi < 35) return 0.25;
    return 0.35;
  }

  private calculateSleepImpact(sleepQuality?: number, hoursSlept?: number): number {
    let impact = 0;

    if (sleepQuality) {
      impact += (6 - sleepQuality) * 0.1;
    }

    if (hoursSlept) {
      if (hoursSlept < 5) impact += 0.4;
      else if (hoursSlept < 6) impact += 0.3;
      else if (hoursSlept < 7) impact += 0.2;
      else if (hoursSlept > 9) impact += 0.1;
    }

    return impact;
  }

  private normalizeHrv(hrv: number): number {
    return (hrv - (this.expectedHrv - this.hrvRange)) / (2 * this.hrvRange);
  }

  private calculateBaselineStress(hr: number, hrv: number): number {
    const hrNorm = Math.max(0, Math.min(1, (hr - 60) / 40));
    const hrvNorm = this.normalizeHrv(hrv);
    return (0.4 * hrNorm + 0.6 * (1 - hrvNorm)) * 100;
  }

  private applySmoothing(currentStress: number): number {
    if (this.lastStressValue === null) {
      this.lastStressValue = currentStress;
      return currentStress;
    }

    const maxChange = currentStress > 100 ? 30 : currentStress > 80 ? 20 : 15;
    const change = currentStress - this.lastStressValue;
    const smoothedChange = Math.max(-maxChange, Math.min(maxChange, change));
    
    const smoothedStress = this.lastStressValue + smoothedChange;
    this.lastStressValue = smoothedStress;
    return smoothedStress;
  }

  private getStressLevel(stressIndex: number): string {
    if (stressIndex <= 20) return "Very Low";
    if (stressIndex <= 40) return "Low";
    if (stressIndex <= 60) return "Moderate";
    if (stressIndex <= 80) return "High";
    if (stressIndex <= 100) return "Very High";
    return "Extreme";
  }

  private median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  }

  calculateHourlyStress(hourlyData: HourlyData, sleepData?: { 
    sleepQuality?: number; 
    hoursSlept?: number; 
  }): StressResult {
    if (!hourlyData.heartRates.length || !hourlyData.hrvValues.length) {
      throw new Error("Insufficient heart rate or HRV data for the hour");
    }

    // Calculate median values for the hour
    const heartRate = this.median(hourlyData.heartRates.map(hr => hr.value));
    const hrv = this.median(hourlyData.hrvValues.map(hrv => hrv.value));
    const respiratoryRate = hourlyData.respiratoryRates.length > 0
      ? this.median(hourlyData.respiratoryRates.map(rr => rr.value))
      : undefined;

    // Validate ranges
    if (heartRate < 30 || heartRate > 200) {
      throw new Error("Hourly median heart rate out of valid range (30-200 bpm)");
    }
    if (hrv < 0 || hrv > 300) {
      throw new Error("Hourly median HRV out of valid range (0-300 ms)");
    }

    const baselineStress = this.calculateBaselineStress(heartRate, hrv);
    const bmiImpact = this.calculateBmiImpact();
    const sleepImpact = this.calculateSleepImpact(
      sleepData?.sleepQuality,
      sleepData?.hoursSlept
    );

    let stressScore = baselineStress * (1 + bmiImpact + sleepImpact);

    if (respiratoryRate !== undefined) {
      const rrImpact = (respiratoryRate - 12) / 20;
      stressScore += rrImpact * 10;
    }

    stressScore = Math.max(0, stressScore);
    const finalStress = this.applySmoothing(stressScore);

    return {
      stressIndex: Math.round(finalStress * 10) / 10,
      stressLevel: this.getStressLevel(finalStress),
      isElevated: finalStress > 100,
      baselineStress: Math.round(baselineStress * 10) / 10,
      factors: {
        bmiImpact: Math.round(bmiImpact * 100),
        sleepImpact: Math.round(sleepImpact * 100),
      },
      timestamp: new Date(),
    };
  }
}

