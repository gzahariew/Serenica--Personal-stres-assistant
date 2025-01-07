// Enums for standardization
const Gender = {
  MALE: "male",
  FEMALE: "female",
};

const SleepQuality = {
  VERY_GOOD: 5,
  GOOD: 4,
  NEUTRAL: 3,
  BAD: 2,
  VERY_BAD: 1,
};

class StressIndexCalculator {
  constructor(userProfile) {
    this.validateProfile(userProfile);
    this.profile = userProfile;
    this.lastStressValue = null;
    this.setAgeBasedRanges();
  }

  validateProfile(profile) {
    const required = ["age", "gender", "bmi"];
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

  setAgeBasedRanges() {
    const age = this.profile.age;
    // Age-based HRV adjustments
    let baseHrv =
      age < 30 ? 100 : age < 40 ? 85 : age < 50 ? 70 : age < 60 ? 55 : 40;

    // Gender adjustment
    if (this.profile.gender === Gender.FEMALE) {
      baseHrv *= 0.9;
    }

    this.expectedHrv = baseHrv;
    this.hrvRange = baseHrv * 0.5;
  }

  calculateBmiImpact() {
    const bmi = this.profile.bmi;
    if (bmi < 18.5) return 0.15; // Underweight - increased impact
    if (bmi < 25) return 0; // Normal
    if (bmi < 30) return 0.15; // Overweight
    if (bmi < 35) return 0.25; // Obese
    return 0.35; // Severely obese
  }

  calculateSleepImpact(sleepQuality, hoursSlept) {
    let impact = 0;

    // Impact based on sleep quality (1-5 scale)
    if (sleepQuality) {
      impact += (6 - sleepQuality) * 0.1; // 0.1 to 0.5 impact
    }

    // Impact based on sleep duration if available
    if (hoursSlept) {
      if (hoursSlept < 5) impact += 0.4;
      else if (hoursSlept < 6) impact += 0.3;
      else if (hoursSlept < 7) impact += 0.2;
      else if (hoursSlept > 9) impact += 0.1;
    }

    return impact;
  }

  normalizeHrv(hrv) {
    return (hrv - (this.expectedHrv - this.hrvRange)) / (2 * this.hrvRange);
  }

  calculateBaselineStress(hr, hrv) {
    // Normalize heart rate (resting HR typically 60-100)
    const hrNorm = Math.max(0, Math.min(1, (hr - 60) / 40));

    // Normalize HRV using age-adjusted values
    const hrvNorm = this.normalizeHrv(hrv);

    // Calculate base stress (inverse relationship with HRV)
    return (0.4 * hrNorm + 0.6 * (1 - hrvNorm)) * 100;
  }

  applySmoothing(currentStress) {
    if (this.lastStressValue === null) {
      this.lastStressValue = currentStress;
      return currentStress;
    }

    // Allow larger changes for high stress situations
    const maxChange = currentStress > 100 ? 30 : currentStress > 80 ? 20 : 15;

    const change = currentStress - this.lastStressValue;
    const smoothedChange = Math.max(-maxChange, Math.min(maxChange, change));

    const smoothedStress = this.lastStressValue + smoothedChange;
    this.lastStressValue = smoothedStress;
    return smoothedStress;
  }

  getStressLevel(stressIndex) {
    if (stressIndex <= 20) return "Very Low";
    if (stressIndex <= 40) return "Low";
    if (stressIndex <= 60) return "Moderate";
    if (stressIndex <= 80) return "High";
    if (stressIndex <= 100) return "Very High";
    return "Extreme";
  }

  calculateStress(data) {
    // Validate required minute data
    if (!data.heartRate || !data.hrvMs) {
      throw new Error("Heart rate and HRV are required for stress calculation");
    }

    // Validate ranges
    if (data.heartRate < 30 || data.heartRate > 200) {
      throw new Error("Heart rate out of valid range (30-200 bpm)");
    }
    if (data.hrvMs < 0 || data.hrvMs > 300) {
      throw new Error("HRV out of valid range (0-300 ms)");
    }

    // Calculate baseline stress using HR and HRV
    const baselineStress = this.calculateBaselineStress(
      data.heartRate,
      data.hrvMs
    );

    // Apply profile-based adjustments
    const bmiImpact = this.calculateBmiImpact();

    // Calculate sleep impact
    const sleepImpact = this.calculateSleepImpact(
      data.sleepQuality,
      data.hoursSlept
    );

    // Calculate initial stress score
    let stressScore = baselineStress * (1 + bmiImpact + sleepImpact);

    // Additional adjustments for respiratory rate if available
    if (data.respiratoryRate !== undefined) {
      const rrImpact = (data.respiratoryRate - 12) / 20;
      stressScore += rrImpact * 10;
    }

    // Allow stress to go above 100 in severe cases
    stressScore = Math.max(0, stressScore);

    // Apply smoothing
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

// Example usage:
/* 
  const userProfile = {
    age: 35,
    gender: Gender.FEMALE,
    bmi: 23.5
  };
  
  const minuteData = {
    heartRate: 72,
    hrvMs: 45,
    respiratoryRate: 14,
    sleepQuality: SleepQuality.GOOD,  // 1-5 scale
    hoursSlept: 7.5                   // Optional
  };
  
  const calculator = new StressIndexCalculator(userProfile);
  const result = calculator.calculateStress(minuteData);
  console.log(result);
  */

export { StressIndexCalculator, Gender, SleepQuality };
