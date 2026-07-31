import { HeartPulse, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '@/lib/context';
import { useNavigate } from '@/lib/router';

export default function Footer() {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <footer className="mt-16 border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="section py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                <HeartPulse className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                Swasth<span className="text-primary-500">Gram</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              A rural healthcare companion that helps villagers understand their
              symptoms, assess risk, and reach the right hospital in time.
            </p>
            <a
              href="tel:108"
              className="btn-danger mt-5 w-fit"
            >
              <Phone className="h-4 w-4" />
              Emergency Ambulance: 108
            </a>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              {[
                { label: t('nav.predict'), path: '/predict' },
                { label: t('nav.hospitals'), path: '/hospitals' },
                { label: t('nav.dashboard'), path: '/dashboard' },
                { label: t('nav.about'), path: '/about' },
                { label: t('nav.contact'), path: '/contact' },
              ].map((l) => (
                <li key={l.path}>
                  <button
                    onClick={() => navigate(l.path)}
                    className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-500" /> 108 (Ambulance)
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-500" /> help@swasthgram.in
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" /> Rural Health Initiative, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800">
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} SwasthGram — For informational purposes
            only. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
