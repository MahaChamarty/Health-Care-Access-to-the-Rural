import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Activity,
  FileBarChart,
  Plus,
  Trash2,
  X,
  MapPin,
  Phone,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useNavigate } from '@/lib/router';
import { supabase, type Hospital, type Disease, type Prediction } from '@/lib/supabase';

type Tab = 'hospitals' | 'diseases' | 'reports';

export default function Admin() {
  const { t, session, profile, loading } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('hospitals');

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [reports, setReports] = useState<Prediction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showDiseaseForm, setShowDiseaseForm] = useState(false);

  useEffect(() => {
    if (!loading && (!session || profile?.role !== 'admin')) {
      navigate('/login');
    }
  }, [loading, session, profile, navigate]);

  useEffect(() => {
    if (session && profile?.role === 'admin') {
      loadData();
    }
  }, [session, profile]);

  const loadData = async () => {
    const [h, d, r] = await Promise.all([
      supabase.from('hospitals').select('*').order('created_at', { ascending: false }),
      supabase.from('diseases').select('*').order('created_at', { ascending: false }),
      supabase.from('predictions').select('*').order('created_at', { ascending: false }),
    ]);
    setHospitals((h.data as Hospital[]) ?? []);
    setDiseases((d.data as Disease[]) ?? []);
    setReports((r.data as Prediction[]) ?? []);
    setDataLoading(false);
  };

  if (loading || (session && profile === null)) {
    return (
      <div className="section py-24 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  if (!session || profile?.role !== 'admin') {
    return null;
  }

  const deleteHospital = async (id: string) => {
    if (!confirm('Delete this hospital?')) return;
    await supabase.from('hospitals').delete().eq('id', id);
    setHospitals((prev) => prev.filter((h) => h.id !== id));
  };

  const deleteDisease = async (id: string) => {
    if (!confirm('Delete this disease?')) return;
    await supabase.from('diseases').delete().eq('id', id);
    setDiseases((prev) => prev.filter((d) => d.id !== id));
  };

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'hospitals', label: t('admin.hospitals'), icon: Building2 },
    { key: 'diseases', label: t('admin.diseases'), icon: Stethoscope },
    { key: 'reports', label: t('admin.reports'), icon: FileBarChart },
  ];

  return (
    <div className="section py-10">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-secondary-500 to-primary-500 text-white">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t('admin.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage hospitals, diseases, and view user reports.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === tb.key
                ? 'bg-primary-500 text-white shadow-card'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
            }`}
          >
            <tb.icon className="h-4 w-4" />
            {tb.label}
          </button>
        ))}
      </div>

      {dataLoading ? (
        <p className="mt-12 text-center text-slate-500">{t('common.loading')}</p>
      ) : (
        <div className="mt-6">
          {tab === 'hospitals' && (
            <div>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => setShowHospitalForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4" /> Add Hospital
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hospitals.map((h) => (
                  <div key={h.id} className="card p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-800 dark:text-white">
                        {h.name}
                      </h3>
                      <button
                        onClick={() => deleteHospital(h.id)}
                        className="btn-ghost px-2 py-1 text-danger-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 flex items-start gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                      {h.address}, {h.district}, {h.state}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Phone className="h-3 w-3" /> {h.phone || '-'}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="chip bg-primary-50 text-xs text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                        {h.hospital_type}
                      </span>
                      {h.emergency_available && (
                        <span className="chip bg-danger-50 text-xs text-danger-700 dark:bg-danger-900/30 dark:text-danger-300">
                          Emergency
                        </span>
                      )}
                      {h.open_24x7 && (
                        <span className="chip bg-secondary-50 text-xs text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                          24x7
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'diseases' && (
            <div>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => setShowDiseaseForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4" /> Add Disease
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {diseases.map((d) => (
                  <div key={d.id} className="card p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-800 dark:text-white">
                        {d.name}
                      </h3>
                      <button
                        onClick={() => deleteDisease(d.id)}
                        className="btn-ghost px-2 py-1 text-danger-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span
                      className={`chip mt-2 text-xs ${
                        d.risk_level === 'high'
                          ? 'bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300'
                          : 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                      }`}
                    >
                      {d.risk_level.toUpperCase()} RISK
                    </span>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <strong>Symptoms:</strong> {d.symptoms.join(', ')}
                    </p>
                    {d.suggested_medicines.length > 0 && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <strong>Medicines:</strong> {d.suggested_medicines.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'reports' && (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400 dark:border-slate-800">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Disease</th>
                    <th className="p-4">Risk</th>
                    <th className="p-4">Symptoms</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No reports yet.
                      </td>
                    </tr>
                  ) : (
                    reports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-slate-50 dark:border-slate-800"
                      >
                        <td className="p-4 font-medium text-slate-700 dark:text-slate-200">
                          {r.patient_name}
                          <span className="block text-xs text-slate-400">
                            {[r.village, r.district, r.state].filter(Boolean).join(', ')}
                          </span>
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-200">
                          {r.likely_disease}
                        </td>
                        <td className="p-4">
                          <span
                            className={`chip text-xs ${
                              r.risk_level === 'high'
                                ? 'bg-danger-500 text-white'
                                : 'bg-primary-500 text-white'
                            }`}
                          >
                            {r.risk_level.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                          {r.symptoms.join(', ')}
                        </td>
                        <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(r.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showHospitalForm && (
        <HospitalForm
          onClose={() => setShowHospitalForm(false)}
          onSaved={() => {
            setShowHospitalForm(false);
            loadData();
          }}
        />
      )}
      {showDiseaseForm && (
        <DiseaseForm
          onClose={() => setShowDiseaseForm(false)}
          onSaved={() => {
            setShowDiseaseForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function HospitalForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    address: '',
    district: '',
    state: '',
    phone: '',
    hospital_type: 'government',
    emergency_available: true,
    open_24x7: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { error } = await supabase.from('hospitals').insert(form);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  };

  return (
    <Modal title="Add Hospital" onClose={onClose}>
      <form onSubmit={save} className="grid gap-4">
        <div>
          <label className="label">Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            className="input"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">District</label>
            <input
              className="input"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
            />
          </div>
          <div>
            <label className="label">State</label>
            <input
              className="input"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={form.hospital_type}
              onChange={(e) =>
                setForm({ ...form, hospital_type: e.target.value })
              }
            >
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
          </div>
          <label className="flex items-end gap-2 pb-3 text-sm">
            <input
              type="checkbox"
              checked={form.emergency_available}
              onChange={(e) =>
                setForm({ ...form, emergency_available: e.target.checked })
              }
            />
            Emergency
          </label>
          <label className="flex items-end gap-2 pb-3 text-sm">
            <input
              type="checkbox"
              checked={form.open_24x7}
              onChange={(e) => setForm({ ...form, open_24x7: e.target.checked })}
            />
            24x7
          </label>
        </div>
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : 'Save Hospital'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DiseaseForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    risk_level: 'low',
    symptoms: '',
    suggested_medicines: '',
    home_remedies: '',
    advice: '',
    prevention_tips: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      risk_level: form.risk_level,
      symptoms: form.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
      suggested_medicines: form.suggested_medicines
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      home_remedies: form.home_remedies.split(',').map((s) => s.trim()).filter(Boolean),
      advice: form.advice,
      prevention_tips: form.prevention_tips
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const { error } = await supabase.from('diseases').insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  };

  return (
    <Modal title="Add Disease" onClose={onClose}>
      <form onSubmit={save} className="grid gap-4">
        <div>
          <label className="label">Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Risk Level</label>
          <select
            className="input"
            value={form.risk_level}
            onChange={(e) => setForm({ ...form, risk_level: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">Symptoms (comma separated)</label>
          <input
            className="input"
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            placeholder="Fever, Cough, Body Pain"
          />
        </div>
        <div>
          <label className="label">Suggested Medicines (comma separated)</label>
          <input
            className="input"
            value={form.suggested_medicines}
            onChange={(e) =>
              setForm({ ...form, suggested_medicines: e.target.value })
            }
            placeholder="Paracetamol"
          />
        </div>
        <div>
          <label className="label">Home Remedies (comma separated)</label>
          <input
            className="input"
            value={form.home_remedies}
            onChange={(e) => setForm({ ...form, home_remedies: e.target.value })}
            placeholder="Drink water, Rest"
          />
        </div>
        <div>
          <label className="label">Advice</label>
          <textarea
            className="input min-h-[80px]"
            value={form.advice}
            onChange={(e) => setForm({ ...form, advice: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Prevention Tips (comma separated)</label>
          <input
            className="input"
            value={form.prevention_tips}
            onChange={(e) => setForm({ ...form, prevention_tips: e.target.value })}
          />
        </div>
        {error && <p className="text-sm text-danger-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : 'Save Disease'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-card-hover dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            {title}
          </h2>
          <button onClick={onClose} className="btn-ghost px-2 py-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
