import { useEffect, useMemo, useState } from 'react';
import {
  Stethoscope,
  Mic,
  MicOff,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Pill,
  Home as HomeIcon,
  Lightbulb,
  Activity,
  MapPin,
  Phone,
  Navigation,
  Building2,
  Clock,
  FileDown,
  Printer,
  HeartPulse,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useNavigate } from '@/lib/router';
import { supabase, type Symptom, type Disease, type Hospital } from '@/lib/supabase';
import {
  predictDisease,
  haversineDistance,
  type PredictionResult,
  DISCLAIMER,
} from '@/lib/prediction';

const SYMPTOM_CATEGORIES = [
  { key: 'respiratory', label: 'Respiratory', icon: Activity },
  { key: 'heart', label: 'Heart', icon: HeartPulse },
  { key: 'skin', label: 'Skin', icon: ShieldCheck },
  { key: 'eye', label: 'Eye', icon: Lightbulb },
  { key: 'stomach', label: 'Stomach', icon: Pill },
  { key: 'neurological', label: 'Neurological', icon: Activity },
  { key: 'general', label: 'General', icon: Stethoscope },
];

export default function Predict() {
  const { t, session } = useApp();
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    village: '',
    district: '',
    state: '',
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [additional, setAdditional] = useState('');
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    (async () => {
      const [sym, dis, hos] = await Promise.all([
        supabase.from('symptoms').select('*').order('category, name'),
        supabase.from('diseases').select('*'),
        supabase.from('hospitals').select('*'),
      ]);
      setSymptoms((sym.data as Symptom[]) ?? []);
      setDiseases((dis.data as Disease[]) ?? []);
      setHospitals((hos.data as Hospital[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const allSelected = useMemo(() => {
    const extra = additional
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return [...new Set([...selected, ...extra])];
  }, [selected, additional]);

  const grouped = useMemo(() => {
    const map: Record<string, Symptom[]> = {};
    for (const s of symptoms) {
      (map[s.category] ||= []).push(s);
    }
    return map;
  }, [symptoms]);

  const toggleSymptom = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
  };

  const reset = () => {
    setResult(null);
    setSelected([]);
    setAdditional('');
    setSavedMsg('');
  };

  const handleVoice = () => {
    const SR =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input is not supported in this browser.');
      return;
    }
    const Recognition = SR as new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
      onend: () => void;
      start: () => void;
      stop: () => void;
    };
    const rec = new Recognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase();
      const matched = symptoms.filter((s) =>
        transcript.includes(s.name.toLowerCase()),
      );
      if (matched.length) {
        setSelected((prev) => [
          ...new Set([...prev, ...matched.map((m) => m.name)]),
        ]);
      }
      if (transcript && !matched.length) {
        setAdditional((prev) => (prev ? `${prev}, ${transcript}` : transcript));
      }
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allSelected.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }
    const r = predictDisease(allSelected, diseases);
    setResult(r);
    setTimeout(
      () => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' }),
      100,
    );
  };

  const handleSave = async () => {
    if (!session || !result) return;
    setSubmitting(true);
    setSavedMsg('');
    const { error } = await supabase.from('predictions').insert({
      patient_name: form.name,
      age: form.age ? Number(form.age) : null,
      gender: form.gender || null,
      village: form.village,
      district: form.district,
      state: form.state,
      symptoms: allSelected,
      likely_disease: result.likelyDisease,
      risk_level: result.riskLevel,
    });
    setSubmitting(false);
    setSavedMsg(error ? 'Could not save. Please try again.' : 'Saved to your history.');
  };

  const handleDownload = () => {
    if (!result) return;
    const html = buildReportHTML(form, allSelected, result);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swasthgram-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!result) return;
    const html = buildReportHTML(form, allSelected, result, true);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  if (loading) {
    return (
      <div className="section py-24 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  const nearbyHospitals = result?.riskLevel === 'high'
    ? hospitals
        .filter((h) => !form.state || h.state === form.state)
        .slice(0, 5)
    : [];

  return (
    <div className="section py-10">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip bg-primary-50 text-primary-700 ring-1 ring-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:ring-primary-800">
          <Stethoscope className="h-3.5 w-3.5" />
          AI Risk Assessment
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl dark:text-white">
          {t('predict.title')}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {t('predict.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-4xl">
        <div className="card p-6 md:p-8">
          {/* Patient details */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label">{t('predict.form.name')}</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">{t('predict.form.age')}</label>
              <input
                type="number"
                min={0}
                max={120}
                className="input"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t('predict.form.gender')}</label>
              <select
                className="input"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">{t('predict.form.village')}</label>
              <input
                className="input"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t('predict.form.district')}</label>
              <input
                className="input"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />
            </div>
            <div>
              <label className="label">{t('predict.form.state')}</label>
              <input
                className="input"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
          </div>

          {/* Symptoms */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label className="label mb-0">{t('predict.form.symptoms')}</label>
              <button
                type="button"
                onClick={handleVoice}
                className={`btn-ghost px-3 py-1.5 text-xs ${
                  listening ? 'text-danger-600' : ''
                }`}
              >
                {listening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                {t('predict.form.voice')}
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {SYMPTOM_CATEGORIES.map((cat) => {
                const items = grouped[cat.key];
                if (!items?.length) return null;
                return (
                  <div key={cat.key}>
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <cat.icon className="h-3.5 w-3.5" />
                      {cat.label}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((s) => {
                        const active = selected.includes(s.name);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleSymptom(s.name)}
                            className={`chip ring-1 transition-all ${
                              active
                                ? 'bg-primary-500 text-white ring-primary-500 shadow-glow'
                                : 'bg-white text-slate-600 ring-slate-200 hover:ring-primary-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
                            }`}
                          >
                            {active && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <label className="label">{t('predict.form.additional')}</label>
              <input
                className="input"
                value={additional}
                onChange={(e) => setAdditional(e.target.value)}
                placeholder="e.g. sneezing, sore throat"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              <Activity className="h-4 w-4" />
              {t('predict.form.submit')}
            </button>
            <button type="button" onClick={reset} className="btn-secondary">
              <RotateCcw className="h-4 w-4" />
              {t('predict.form.reset')}
            </button>
          </div>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div id="result" className="mx-auto mt-10 max-w-4xl animate-fade-in-up">
          <div
            className={`card overflow-hidden ${
              result.riskLevel === 'high'
                ? 'ring-2 ring-danger-200 dark:ring-danger-800'
                : 'ring-2 ring-primary-200 dark:ring-primary-800'
            }`}
          >
            <div
              className={`p-6 ${
                result.riskLevel === 'high'
                  ? 'bg-gradient-to-r from-danger-50 to-warning-50 dark:from-danger-900/30 dark:to-warning-900/20'
                  : 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white ${
                    result.riskLevel === 'high'
                      ? 'bg-gradient-to-br from-danger-500 to-danger-600'
                      : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                  }`}
                >
                  {result.riskLevel === 'high' ? (
                    <AlertTriangle className="h-7 w-7 animate-pulse-soft" />
                  ) : (
                    <ShieldCheck className="h-7 w-7" />
                  )}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('predict.result.likely')}
                  </p>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {result.likelyDisease}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`chip font-bold ${
                        result.riskLevel === 'high'
                          ? 'bg-danger-500 text-white'
                          : 'bg-primary-500 text-white'
                      }`}
                    >
                      {t('predict.result.risk')}: {t(
                        result.riskLevel === 'high'
                          ? 'predict.result.high'
                          : 'predict.result.low',
                      )}
                    </span>
                    {result.matchScore > 0 && (
                      <span className="chip bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                        Match: {Math.round(result.matchScore * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {result.riskLevel === 'high' && (
                <div className="mb-6 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-800 dark:bg-danger-900/20">
                  <div className="flex items-center gap-2 text-danger-700 dark:text-danger-300">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-bold">{t('predict.result.emergency')}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-danger-700 dark:text-danger-300">
                    {t('predict.result.emergencyMsg')} {result.advice}
                  </p>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {result.suggestedMedicines.length > 0 && (
                  <InfoBlock
                    icon={Pill}
                    title={t('predict.result.medicines')}
                    items={result.suggestedMedicines}
                  />
                )}
                <InfoBlock
                  icon={HomeIcon}
                  title={t('predict.result.remedies')}
                  items={result.homeRemedies}
                />
                <InfoBlock
                  icon={Lightbulb}
                  title={t('predict.result.prevention')}
                  items={result.preventionTips}
                />
                {result.riskLevel === 'low' && (
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <Stethoscope className="h-5 w-5 text-primary-500" />
                      <span className="font-bold">{t('predict.result.advice')}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {result.advice}
                    </p>
                  </div>
                )}
              </div>

              {/* Hospital recommendations for high risk */}
              {nearbyHospitals.length > 0 && (
                <div className="mt-8">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
                    <Building2 className="h-5 w-5 text-primary-500" />
                    Recommended Hospitals
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {nearbyHospitals.map((h) => (
                      <HospitalCard key={h.id} hospital={h} />
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-8 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-800">
                <strong>Disclaimer:</strong> {DISCLAIMER}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={handleDownload} className="btn-secondary">
                  <FileDown className="h-4 w-4" />
                  {t('common.download')}
                </button>
                <button onClick={handlePrint} className="btn-secondary">
                  <Printer className="h-4 w-4" />
                  {t('common.print')}
                </button>
                {session ? (
                  <button
                    onClick={handleSave}
                    disabled={submitting}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    {submitting ? 'Saving...' : 'Save to History'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4" />
                    {t('predict.result.savePrompt')}
                  </button>
                )}
              </div>
              {savedMsg && (
                <p className="mt-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                  {savedMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <Icon className="h-5 w-5 text-primary-500" />
        <span className="font-bold">{title}</span>
      </div>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  const mapsUrl = hospital.latitude && hospital.longitude
    ? `https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`
    : `https://www.google.com/maps?q=${encodeURIComponent(
        `${hospital.name}, ${hospital.address}, ${hospital.district}, ${hospital.state}`,
      )}`;
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-slate-800 dark:text-white">{hospital.name}</h4>
        <span
          className={`chip text-xs ${
            hospital.hospital_type === 'government'
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
              : 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300'
          }`}
        >
          {hospital.hospital_type === 'government' ? 'Govt' : 'Private'}
        </span>
      </div>
      <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {hospital.address}, {hospital.district}, {hospital.state}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {hospital.emergency_available && (
          <span className="chip bg-danger-50 text-danger-700 text-xs dark:bg-danger-900/30 dark:text-danger-300">
            <AlertTriangle className="h-3 w-3" /> Emergency
          </span>
        )}
        {hospital.open_24x7 && (
          <span className="chip bg-primary-50 text-primary-700 text-xs dark:bg-primary-900/30 dark:text-primary-300">
            <Clock className="h-3 w-3" /> 24x7
          </span>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        {hospital.phone && (
          <a
            href={`tel:${hospital.phone}`}
            className="btn-secondary flex-1 px-3 py-2 text-xs"
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 px-3 py-2 text-xs"
        >
          <Navigation className="h-3.5 w-3.5" />
          Directions
        </a>
      </div>
    </div>
  );
}

function buildReportHTML(
  form: { name: string; age: string; gender: string; village: string; district: string; state: string },
  symptoms: string[],
  result: PredictionResult,
  forPrint = false,
): string {
  const date = new Date().toLocaleString();
  return `<!doctype html><html><head><meta charset="utf-8"><title>SwasthGram Health Report</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:0 24px;color:#1e293b}
    h1{color:#109361} .risk{display:inline-block;padding:4px 12px;border-radius:999px;font-weight:bold;color:#fff}
    .high{background:#dc2626} .low{background:#1bb477}
    .box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:12px 0}
    ul{margin:0;padding-left:20px} .muted{color:#64748b;font-size:13px}
    .disc{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:12px;color:#92400e;font-size:13px}
  </style></head><body>
  <h1>SwasthGram Health Report</h1>
  <p class="muted">Generated: ${date}</p>
  <div class="box"><strong>Patient:</strong> ${form.name || '-'} &nbsp; Age: ${form.age || '-'} &nbsp; Gender: ${form.gender || '-'}<br>
  Location: ${[form.village, form.district, form.state].filter(Boolean).join(', ') || '-'}</div>
  <div class="box"><strong>Symptoms:</strong> ${symptoms.join(', ')}</div>
  <div class="box"><strong>Likely Condition:</strong> ${result.likelyDisease}<br>
  <span class="risk ${result.riskLevel === 'high' ? 'high' : 'low'}">RISK: ${result.riskLevel.toUpperCase()}</span>
  ${result.matchScore > 0 ? `&nbsp;Match: ${Math.round(result.matchScore * 100)}%` : ''}</div>
  ${result.suggestedMedicines.length ? `<div class="box"><strong>Suggested Medicines:</strong><ul>${result.suggestedMedicines.map((m) => `<li>${m}</li>`).join('')}</ul></div>` : ''}
  ${result.homeRemedies.length ? `<div class="box"><strong>Home Remedies:</strong><ul>${result.homeRemedies.map((m) => `<li>${m}</li>`).join('')}</ul></div>` : ''}
  ${result.preventionTips.length ? `<div class="box"><strong>Prevention Tips:</strong><ul>${result.preventionTips.map((m) => `<li>${m}</li>`).join('')}</ul></div>` : ''}
  <div class="box"><strong>Advice:</strong> ${result.advice}</div>
  <div class="disc"><strong>Disclaimer:</strong> ${DISCLAIMER}</div>
  ${forPrint ? '<script>window.onload=()=>window.print()</script>' : ''}
  </body></html>`;
}
