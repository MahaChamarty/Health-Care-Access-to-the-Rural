import type { Disease } from './supabase';

export type PredictionResult = {
  likelyDisease: string;
  riskLevel: 'low' | 'high';
  matchScore: number; // 0..1 confidence of the match
  suggestedMedicines: string[];
  homeRemedies: string[];
  advice: string;
  preventionTips: string[];
  disclaimer: string;
};

export const DISCLAIMER =
  'This prediction is for informational purposes only and is not a substitute for professional medical advice. If you experience severe symptoms such as chest pain, difficulty breathing, severe bleeding, unconsciousness, or sudden weakness, seek emergency medical care immediately.';

// Emergency symptoms that force a HIGH risk result regardless of mapping.
const EMERGENCY_SYMPTOMS = new Set([
  'Chest Pain',
  'Difficulty Breathing',
  'Severe Abdominal Pain',
  'Blood in Stool',
  'High Fever',
  'Vision Problems',
  'Dizziness',
]);

/**
 * Rule-based prediction engine.
 *
 * Scores every disease in the catalog by Jaccard overlap between the user's
 * selected symptoms and the disease's known symptoms. The best match wins.
 * Emergency symptoms always escalate the result to HIGH risk.
 *
 * The shape of the return is intentionally model-agnostic so an ML model can
 * be swapped in later by replacing only this function.
 */
export function predictDisease(
  selectedSymptoms: string[],
  diseases: Disease[],
): PredictionResult | null {
  if (selectedSymptoms.length === 0 || diseases.length === 0) return null;

  const userSet = new Set(selectedSymptoms.map((s) => s.trim()));

  let best: { disease: Disease; score: number } | null = null;

  for (const disease of diseases) {
    const diseaseSet = new Set(disease.symptoms);
    if (diseaseSet.size === 0) continue;

    let overlap = 0;
    for (const s of userSet) {
      if (diseaseSet.has(s)) overlap += 1;
    }
    // Jaccard-style score: overlap / union
    const union = new Set([...userSet, ...diseaseSet]).size;
    const score = overlap / union;

    if (!best || score > best.score) {
      best = { disease, score };
    }
  }

  if (!best || best.score === 0) {
    return {
      likelyDisease: 'Unknown / Needs Medical Evaluation',
      riskLevel: 'low',
      matchScore: 0,
      suggestedMedicines: [],
      homeRemedies: ['Drink water', 'Take rest'],
      advice:
        'Your symptoms did not match a known condition. Please consult a doctor for proper evaluation.',
      preventionTips: ['Maintain hygiene', 'Stay hydrated', 'Eat healthy food'],
      disclaimer: DISCLAIMER,
    };
  }

  const { disease, score } = best;

  // Emergency override: any emergency symptom forces HIGH risk.
  const hasEmergency = [...userSet].some((s) => EMERGENCY_SYMPTOMS.has(s));
  const riskLevel: 'low' | 'high' =
    hasEmergency || disease.risk_level === 'high' ? 'high' : 'low';

  return {
    likelyDisease: disease.name,
    riskLevel,
    matchScore: score,
    suggestedMedicines: disease.suggested_medicines,
    homeRemedies: disease.home_remedies,
    advice: disease.advice,
    preventionTips: disease.prevention_tips,
    disclaimer: DISCLAIMER,
  };
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
