import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Lightbulb,
  Phone,
  Landmark,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useNavigate } from '@/lib/router';
import {
  supabase,
  type Prediction,
  type EmergencyContact,
  type HealthScheme,
} from '@/lib/supabase';

const HEALTH_TIPS = [
  'Drink at least 8 glasses of water every day to stay hydrated.',
  'Wash your hands with soap for at least 20 seconds, especially before meals.',
  'Eat fresh fruits and vegetables daily for a stronger immune system.',
  'Sleep 7-8 hours every night — rest is medicine.',
  'Use mosquito nets and repellents to prevent dengue and malaria.',
  'Walk for 30 minutes a day to keep your heart healthy.',
  'Avoid self-medicating with antibiotics — they do not work on viral fevers.',
  'Keep your surroundings clean to prevent skin and water-borne infections.',
  'Monitor your blood pressure and sugar regularly if you are over 40.',
  'Breastfeeding for the first 6 months gives babies the best start in life.',
];

export default function Dashboard() {
  const { t, session, profile } = useApp();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [schemes, setSchemes] = useState<HealthScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    (async () => {
      const [pred, con, sch] = await Promise.all([
        supabase
          .from('predictions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase.from('emergency_contacts').select('*'),
        supabase.from('health_schemes').select('*'),
      ]);
      setPredictions((pred.data as Prediction[]) ?? []);
      setContacts((con.data as EmergencyContact[]) ?? []);
      setSchemes((sch.data as HealthScheme[]) ?? []);
      setLoading(false);
    })();
  }, [session]);

  if (!session) {
    return (
      <div className="section py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Please sign in to view your dashboard.
        </h1>
        <button onClick={() => navigate('/login')} className="btn-primary mt-6">
          {t('nav.login')}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section py-24 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  const deletePrediction = async (id: string) => {
    await supabase.from('predictions').delete().eq('id', id);
    setPredictions((prev) => prev.filter((p) => p.id !== id));
  };

  const highCount = predictions.filter((p) => p.risk_level === 'high').length;

  return (
    <div className="section py-10">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <LayoutDashboard className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('dash.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {profile?.full_name || 'friend'}.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Activity}
          label="Total Predictions"
          value={predictions.length}
          color="primary"
        />
        <StatCard
          icon={ShieldCheck}
          label="Low Risk"
          value={predictions.length - highCount}
          color="success"
        />
        <StatCard
          icon={AlertTriangle}
          label="High Risk"
          value={highCount}
          color="danger"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Prediction history */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Activity className="h-5 w-5 text-primary-500" />
              {t('dash.history')}
            </h2>
            {predictions.length === 0 ? (
              <div className="py-12 text-center">
                <HeartPulse className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">{t('dash.empty')}</p>
                <button
                  onClick={() => navigate('/predict')}
                  className="btn-primary mt-4"
                >
                  {t('nav.predict')}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {predictions.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {p.likely_disease}
                        </span>
                        <span
                          className={`chip text-xs ${
                            p.risk_level === 'high'
                              ? 'bg-danger-500 text-white'
                              : 'bg-primary-500 text-white'
                          }`}
                        >
                          {p.risk_level === 'high'
                            ? t('predict.result.high')
                            : t('predict.result.low')}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {p.patient_name} • {p.symptoms.join(', ')}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deletePrediction(p.id)}
                      className="btn-ghost px-2 py-2 text-danger-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Emergency contacts */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Phone className="h-5 w-5 text-danger-500" />
              {t('dash.contacts')}
            </h2>
            <div className="mt-4 space-y-2">
              {contacts.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone}`}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 text-sm transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <span className="text-slate-700 dark:text-slate-200">{c.name}</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {c.phone}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Health schemes */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
              <Landmark className="h-5 w-5 text-secondary-500" />
              {t('dash.schemes')}
            </h2>
            <div className="mt-4 space-y-3">
              {schemes.map((s) => (
                <div key={s.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {s.name}
                  </p>
                  {s.description && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {s.description}
                    </p>
                  )}
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-semibold text-secondary-600 hover:underline dark:text-secondary-400"
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Health tips */}
      <div className="mt-6 card p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
          <Lightbulb className="h-5 w-5 text-accent-500" />
          {t('dash.tips')}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {HEALTH_TIPS.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: 'primary' | 'success' | 'danger';
}) {
  const colors = {
    primary: 'from-primary-500 to-secondary-500',
    success: 'from-success-500 to-primary-500',
    danger: 'from-danger-500 to-accent-500',
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <span
        className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${colors[color]} text-white`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}
