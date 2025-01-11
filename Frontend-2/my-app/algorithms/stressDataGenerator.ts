import fs from 'fs';
import path from 'path';

interface HealthMetric {
  value: number;
  timestamp: Date;
}

interface HourlyData {
  heartRates: HealthMetric[];
  hrvValues?: HealthMetric[];
  respiratoryRates?: HealthMetric[];
}

// Define the MetricData type to match the structure in your JSON
interface MetricData {
  heart_rate_median: number | null;
  hrv_median: number | null;
  respiratory_rate_median: number | null;
}

interface ParsedData {
  [timestamp: string]: MetricData;
}

function loadAndTransformData(filePath: string): HourlyData {
  const rawData = fs.readFileSync(filePath, 'utf8');
  
  // Cast parsedData to ParsedData type so TypeScript knows its structure
  const parsedData: ParsedData = JSON.parse(rawData);

  const transformedData: HourlyData = {
    heartRates: [],
    hrvValues: [],
    respiratoryRates: []
  };

  // Iterate through the parsed data and transform it
  for (const [timestamp, metrics] of Object.entries(parsedData)) {
    const date = new Date(timestamp);

    // Check and push heart rate if available
    if (metrics["heart_rate_median"] !== null) {
      transformedData.heartRates.push({ value: metrics["heart_rate_median"], timestamp: date });
    }

    // Check and push HRV if available
    if (metrics["hrv_median"] !== null) {
      transformedData.hrvValues!.push({ value: metrics["hrv_median"], timestamp: date });
    }

    // Check and push respiratory rate if available
    if (metrics["respiratory_rate_median"] !== null) {
      transformedData.respiratoryRates!.push({ value: metrics["respiratory_rate_median"], timestamp: date });
    }
  }

  return transformedData;
}

const filePath = path.resolve('./hourly_health_data.json');
const hourlyData = loadAndTransformData(filePath);


console.log(hourlyData);
