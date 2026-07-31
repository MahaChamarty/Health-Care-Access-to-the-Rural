import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Navigation,
  Clock,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { supabase, type Hospital } from '@/lib/supabase';
import { haversineDistance } from '@/lib/prediction';

export default function Hospitals() {
  const { t } = useApp();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [userLoc, setUserLoc] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('hospitals').select('*');
      setHospitals((data as Hospital[]) ?? []);
      setLoading(false);
    })();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {},
      );
    }
  }, []);

  const states = useMemo(
    () => [...new Set(hospitals.map((h) => h.state))].sort(),
    [hospitals],
  );

  const filtered = useMemo(() => {
    let list = hospitals.filter((h) => {
      if (stateFilter && h.state !== stateFilter) return false;
      if (typeFilter && h.hospital_type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.district.toLowerCase().includes(q) ||
          h.state.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q)
        );
      }
      return true;
    });
    if (userLoc) {
      list = list
        .map((h) => ({
          ...h,
          _dist:
            h.latitude && h.longitude
              ? haversineDistance(userLoc.lat, userLoc.lon, h.latitude, h.longitude)
              : null,
        }))
        .sort((a, b) => (a._dist ?? 9999) - (b._dist ?? 9999));
    }
    return list;
  }, [hospitals, stateFilter, typeFilter, search, userLoc]);

  if (loading) {
    return (
      <div className="section py-24 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="section py-10">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip bg-secondary-50 text-secondary-700 ring-1 ring-secondary-100 dark:bg-secondary-900/40 dark:text-secondary-300 dark:ring-secondary-800">
          <Building2 className="h-3.5 w-3.5" />
          Hospital Directory
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 md:text-4xl dark:text-white">
          {t('hospitals.title')}
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {t('hospitals.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="input"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="">{t('hospitals.filter.state')}</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">{t('hospitals.filter.type')}</option>
              <option value="government">{t('hospitals.government')}</option>
              <option value="private">{t('hospitals.private')}</option>
            </select>
          </div>
        </div>
        {userLoc && (
          <p className="mt-2 text-xs text-slate-400">
            <Filter className="mr-1 inline h-3 w-3" />
            Sorted by distance from your location.
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="mx-auto mt-8 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((h) => {
          const mapsUrl =
            h.latitude && h.longitude
              ? `https://www.google.com/maps?q=${h.latitude},${h.longitude}`
              : `https://www.google.com/maps?q=${encodeURIComponent(
                  `${h.name}, ${h.address}, ${h.district}, ${h.state}`,
                )}`;
          return (
            <div
              key={h.id}
              className="card flex flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white">{h.name}</h3>
                <span
                  className={`chip text-xs ${
                    h.hospital_type === 'government'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                      : 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300'
                  }`}
                >
                  {h.hospital_type === 'government'
                    ? t('hospitals.government')
                    : t('hospitals.private')}
                </span>
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-500" />
                {h.address}, {h.district}, {h.state}
              </p>
              {userLoc && h.latitude && h.longitude && (
                <p className="mt-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                  {haversineDistance(
                    userLoc.lat,
                    userLoc.lon,
                    h.latitude,
                    h.longitude,
                  ).toFixed(1)}{' '}
                  km away
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {h.emergency_available && (
                  <span className="chip bg-danger-50 text-danger-700 text-xs dark:bg-danger-900/30 dark:text-danger-300">
                    <AlertTriangle className="h-3 w-3" /> {t('hospitals.emergency')}
                  </span>
                )}
                {h.open_24x7 && (
                  <span className="chip bg-primary-50 text-primary-700 text-xs dark:bg-primary-900/30 dark:text-primary-300">
                    <Clock className="h-3 w-3" /> {t('hospitals.open24x7')}
                  </span>
                )}
              </div>
              <div className="mt-auto flex gap-2 pt-4">
                {h.phone && (
                  <a
                    href={`tel:${h.phone}`}
                    className="btn-secondary flex-1 px-3 py-2 text-xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {t('hospitals.call')}
                  </a>
                )}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 px-3 py-2 text-xs"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  {t('hospitals.directions')}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-slate-500">No hospitals found.</p>
      )}
    </div>
  );
}
