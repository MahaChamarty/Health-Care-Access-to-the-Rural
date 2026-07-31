import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Supabase env vars missing. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Hospital = {
  id: string;
  name: string;
  address: string;
  district: string;
  state: string;
  phone: string;
  hospital_type: 'government' | 'private';
  emergency_available: boolean;
  open_24x7: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
};

export type Disease = {
  id: string;
  name: string;
  risk_level: 'low' | 'high';
  symptoms: string[];
  suggested_medicines: string[];
  home_remedies: string[];
  advice: string;
  prevention_tips: string[];
  created_at?: string;
};

export type Symptom = {
  id: string;
  name: string;
  category: string;
};

export type Prediction = {
  id: string;
  user_id: string;
  patient_name: string;
  age: number | null;
  gender: string | null;
  village: string;
  district: string;
  state: string;
  symptoms: string[];
  likely_disease: string;
  risk_level: 'low' | 'high';
  created_at: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  type: string;
  state: string;
};

export type HealthScheme = {
  id: string;
  name: string;
  description: string;
  state: string;
  url: string;
};

export type Profile = {
  id: string;
  full_name: string;
  role: 'user' | 'admin';
  village: string;
  district: string;
  state: string;
  created_at?: string;
};
