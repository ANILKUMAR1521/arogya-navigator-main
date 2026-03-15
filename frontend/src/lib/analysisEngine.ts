// Vital signs reference ranges by age group
const vitalRanges = [
  { minAge: 1, maxAge: 2, hr: [80, 130], spo2: [95, 100], temp: [36.5, 37.2], ecg: [0.08, 0.12] },
  { minAge: 3, maxAge: 5, hr: [80, 120], spo2: [95, 100], temp: [36.5, 37.2], ecg: [0.09, 0.14] },
  { minAge: 6, maxAge: 12, hr: [70, 110], spo2: [95, 100], temp: [36.5, 37.2], ecg: [0.10, 0.16] },
  { minAge: 13, maxAge: 17, hr: [60, 100], spo2: [95, 100], temp: [36.5, 37.2], ecg: [0.11, 0.17] },
  { minAge: 18, maxAge: 64, hr: [60, 100], spo2: [95, 100], temp: [36.5, 37.2], ecg: [0.12, 0.20] },
  { minAge: 65, maxAge: 100, hr: [60, 95], spo2: [94, 100], temp: [36.1, 37.0], ecg: [0.12, 0.22] },
];

export function getVitalRanges(age: number) {
  return vitalRanges.find(r => age >= r.minAge && age <= r.maxAge) || vitalRanges[vitalRanges.length - 1];
}

export interface HealthFormData {
  diabetes: string;
  asthma: string;
  heartDisease: string;
  pregnancy: string;
  smoking: string;
  alcohol: string;
  exerciseFrequency: string;
}

export interface HealthResult {
  score: number;
  level: 'Healthy' | 'Moderate Risk' | 'High Risk';
  observations: string[];
  recommendations: string[];
  vitalRanges: ReturnType<typeof getVitalRanges>;
}

export function calculateRisk(data: HealthFormData, age: number): HealthResult {
  let score = 0;
  const observations: string[] = [];
  const recommendations: string[] = [];

  if (data.diabetes === 'Yes') { score += 3; observations.push('Diabetes detected'); recommendations.push('Monitor blood sugar levels regularly'); }
  if (data.asthma === 'Yes') { score += 2; observations.push('Asthma detected'); recommendations.push('Keep inhaler accessible, avoid triggers'); }
  if (data.heartDisease === 'Yes') { score += 4; observations.push('Heart disease history'); recommendations.push('Regular cardiac checkups recommended'); }
  if (data.pregnancy === 'Yes') { score += 2; observations.push('Pregnancy status noted'); recommendations.push('Regular prenatal care recommended'); }
  if (data.smoking === 'Yes') { score += 3; observations.push('Smoking increases respiratory risk'); recommendations.push('Quit smoking'); }
  if (data.alcohol === 'Yes') { score += 2; observations.push('Alcohol consumption noted'); recommendations.push('Reduce alcohol intake'); }

  const exerciseMap: Record<string, number> = { 'Daily': 0, 'Weekly': 1, 'Rarely': 2, 'Never': 3 };
  const exerciseScore = exerciseMap[data.exerciseFrequency] ?? 0;
  score += exerciseScore;
  if (exerciseScore >= 2) { observations.push('Exercise recommended'); recommendations.push('Exercise at least 30 minutes daily'); }

  let level: HealthResult['level'] = 'Healthy';
  if (score >= 4) level = 'Moderate Risk';
  if (score >= 8) level = 'High Risk';

  if (level === 'Healthy') recommendations.push('Maintain your healthy lifestyle');
  if (level !== 'Healthy') recommendations.push('Consult a doctor if symptoms appear');

  return { score, level, observations, recommendations, vitalRanges: getVitalRanges(age) };
}
