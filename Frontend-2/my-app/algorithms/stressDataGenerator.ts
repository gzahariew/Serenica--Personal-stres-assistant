import { StressIndexCalculator, Gender, SleepQuality } from './stressIndexAlgo';

export class StressDataGenerator {
  private calculator: StressIndexCalculator;
  private baseHR: number;
  private baseHRV: number;
  private baseRR: number;

  constructor(baseProfile = {
    age: 35,
    gender: Gender.FEMALE,
    bmi: 23.5
  }) {
    this.calculator = new StressIndexCalculator(baseProfile);
    this.baseHR = 70;
    this.baseHRV = 50;
    this.baseRR = 14;
  }

  generateTimeSeriesData(hours = 24, intervalMinutes = 5) {
    const dataPoints = (hours * 60) / intervalMinutes;
    const timeSeriesData = [];
    
    let currentHR = this.baseHR;
    let currentHRV = this.baseHRV;
    let currentRR = this.baseRR;

    for (let i = 0; i < dataPoints; i++) {
      const timeOfDay = (i * intervalMinutes) % (24 * 60);
      const hourOfDay = Math.floor(timeOfDay / 60);

      const circadianEffect = this.getCircadianEffect(hourOfDay);
      const stress = this.generateStressEvent(hourOfDay);
      
      // Ensure values stay within valid ranges
      const heartRate = Math.min(200, Math.max(30, 
        Math.round(currentHR + circadianEffect + stress.hrEffect + this.randomVariation(2))
      ));
      const hrv = Math.min(300, Math.max(0,
        Math.round(currentHRV + (-circadianEffect) + stress.hrvEffect + this.randomVariation(3))
      ));
      const respiratoryRate = Math.min(30, Math.max(8,
        Math.round((currentRR + circadianEffect/3 + stress.rrEffect + this.randomVariation(1)) * 10) / 10
      ));

      const sleepQuality :number = hourOfDay === 0 ? 
        this.randomChoice(Object.values(SleepQuality)) : 
        timeSeriesData[timeSeriesData.length - 1]?.sleepQuality || SleepQuality.NEUTRAL;

      const hoursSlept :number = hourOfDay === 0 ? 
        5 + Math.random() * 4 : 
        timeSeriesData[timeSeriesData.length - 1]?.hoursSlept || 7;

      const dataPoint = {
        timestamp: Date.now() + i * intervalMinutes * 60000,
        heartRate,
        hrvMs: hrv,
        respiratoryRate,
        sleepQuality,
        hoursSlept
      };

      try {
        const stressResult = this.calculator.calculateStress(dataPoint);
        timeSeriesData.push({
          ...dataPoint,
          calculatedStress: stressResult
        });

        currentHR = (currentHR * 0.7) + (heartRate * 0.3);
        currentHRV = (currentHRV * 0.7) + (hrv * 0.3);
        currentRR = (currentRR * 0.7) + (respiratoryRate * 0.3);
      } catch (error) {
        console.warn('Error calculating stress:', error);
      }
    }

    return timeSeriesData;
  }

  private getCircadianEffect(hour: number) {
    return 5 * Math.sin((hour - 6) * Math.PI / 12);
  }

  private generateStressEvent(hour: number) {
    const isWorkHour = hour >= 9 && hour <= 17;
    const stressChance = isWorkHour ? 0.2 : 0.05;
    
    if (Math.random() < stressChance) {
      const intensity = 1 + Math.random() * 2;
      return {
        hrEffect: 15 * intensity,
        hrvEffect: -20 * intensity,
        rrEffect: 4 * intensity
      };
    }
    
    return { hrEffect: 0, hrvEffect: 0, rrEffect: 0 };
  }

  private randomVariation(scale = 1) {
    return (Math.random() - 0.5) * scale * 2;
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}