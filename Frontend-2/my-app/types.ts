
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