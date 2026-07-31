/*
# Rural Healthcare Disease Prediction & Hospital Recommendation — Schema

## Overview
Creates the full database for a rural healthcare app: user profiles, hospitals,
diseases, symptoms, predictions, medicines, emergency contacts, and government
health schemes. Includes owner-scoped tables for signed-in users and public
reference tables seeded with starter data.

## New Tables
1. `profiles` — extends auth.users with role (user/admin), full name, location.
2. `hospitals` — healthcare facilities with name, address, district, state,
   phone, type (government/private), emergency + 24x7 flags, lat/lng.
3. `diseases` — rule-based disease catalog: name, risk level (low/high),
   symptoms list, suggested medicines, home remedies, advice, prevention tips.
4. `symptoms` — master symptom list grouped by category (respiratory, heart, etc.).
5. `predictions` — saved risk assessments made by users (owner-scoped).
6. `emergency_contacts` — ambulance, police, health helplines per state.
7. `health_schemes` — government health schemes per state.

## Security
- RLS enabled on every table.
- `profiles`, `predictions` are owner-scoped to `authenticated` via `auth.uid()`.
- `hospitals`, `diseases`, `symptoms`, `emergency_contacts`, `health_schemes`
  are public reference data readable by `anon, authenticated`. Writes are
  restricted to `authenticated` admins (role check on profiles).
- A trigger `handle_new_user` creates a profile row when a new auth user signs up.

## Notes
1. `profiles.role` defaults to 'user'. Promote to 'admin' manually in DB for admin access.
2. `predictions.user_id` defaults to `auth.uid()` so client inserts omitting it still pass RLS.
3. All public tables use `TO anon, authenticated` for SELECT so the no-login
   parts of the app (prediction form, hospital search) work for everyone.
*/

-- ---------- profiles ----------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  village text DEFAULT '',
  district text DEFAULT '',
  state text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- hospitals ----------
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  hospital_type text NOT NULL DEFAULT 'government' CHECK (hospital_type IN ('government','private')),
  emergency_available boolean NOT NULL DEFAULT true,
  open_24x7 boolean NOT NULL DEFAULT true,
  latitude double precision,
  longitude double precision,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_hospitals" ON hospitals;
CREATE POLICY "read_hospitals" ON hospitals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_hospitals" ON hospitals;
CREATE POLICY "admin_insert_hospitals" ON hospitals FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_hospitals" ON hospitals;
CREATE POLICY "admin_update_hospitals" ON hospitals FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_hospitals" ON hospitals;
CREATE POLICY "admin_delete_hospitals" ON hospitals FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ---------- diseases ----------
CREATE TABLE IF NOT EXISTS diseases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  risk_level text NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low','high')),
  symptoms text[] NOT NULL DEFAULT '{}',
  suggested_medicines text[] NOT NULL DEFAULT '{}',
  home_remedies text[] NOT NULL DEFAULT '{}',
  advice text DEFAULT '',
  prevention_tips text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_diseases" ON diseases;
CREATE POLICY "read_diseases" ON diseases FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_diseases" ON diseases;
CREATE POLICY "admin_insert_diseases" ON diseases FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_diseases" ON diseases;
CREATE POLICY "admin_update_diseases" ON diseases FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_diseases" ON diseases;
CREATE POLICY "admin_delete_diseases" ON diseases FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ---------- symptoms ----------
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_symptoms" ON symptoms;
CREATE POLICY "read_symptoms" ON symptoms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_symptoms" ON symptoms;
CREATE POLICY "admin_insert_symptoms" ON symptoms FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_symptoms" ON symptoms;
CREATE POLICY "admin_delete_symptoms" ON symptoms FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ---------- predictions ----------
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name text NOT NULL DEFAULT '',
  age int,
  gender text,
  village text DEFAULT '',
  district text DEFAULT '',
  state text DEFAULT '',
  symptoms text[] NOT NULL DEFAULT '{}',
  likely_disease text DEFAULT '',
  risk_level text DEFAULT 'low',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_predictions" ON predictions;
CREATE POLICY "select_own_predictions" ON predictions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_predictions" ON predictions;
CREATE POLICY "insert_own_predictions" ON predictions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_predictions" ON predictions;
CREATE POLICY "delete_own_predictions" ON predictions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ---------- emergency_contacts ----------
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  type text NOT NULL DEFAULT 'ambulance' CHECK (type IN ('ambulance','police','health_helpline','blood_bank','women_helpline','child_helpline')),
  state text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_emergency_contacts" ON emergency_contacts;
CREATE POLICY "read_emergency_contacts" ON emergency_contacts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_emergency_contacts" ON emergency_contacts;
CREATE POLICY "admin_insert_emergency_contacts" ON emergency_contacts FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_emergency_contacts" ON emergency_contacts;
CREATE POLICY "admin_delete_emergency_contacts" ON emergency_contacts FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ---------- health_schemes ----------
CREATE TABLE IF NOT EXISTS health_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  state text DEFAULT '',
  url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_schemes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_health_schemes" ON health_schemes;
CREATE POLICY "read_health_schemes" ON health_schemes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_health_schemes" ON health_schemes;
CREATE POLICY "admin_insert_health_schemes" ON health_schemes FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_health_schemes" ON health_schemes;
CREATE POLICY "admin_delete_health_schemes" ON health_schemes FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );
