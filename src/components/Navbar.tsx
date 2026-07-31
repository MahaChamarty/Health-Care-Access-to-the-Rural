import { useState } from 'react';
import {
  HeartPulse,
  Menu,
  X,
  Moon,
  Sun,
  Phone,
  Globe,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useNavigate, useRoute } from '@/lib/router';

export default function Navbar() {
  const { t, theme, toggleTheme, language, setLanguage, session, profile, signOut } =
    useApp();
  const route = useRoute();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const links: { key: string; path: string }[] = [
    { key: 'nav.home', path: '/' },
    { key: 'nav.predict', path: '/predict' },
    { key: 'nav.hospitals', path: '/hospitals' },
    { key: 'nav.dashboard', path: '/dashboard' },
    { key: 'nav.about', path: '/about' },
    { key: 'nav.contact', path: '/contact' },
  ];

  const isActive = (path: string) =>
    path === '/'
      ? route.name === 'home'
      : route.name === path.slice(1);

  const handleNav = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md ring-1 ring-slate-100 dark:bg-slate-950/80 dark:ring-slate-800">
      <div className="section flex h-16 items-center justify-between">
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-card">
            <HeartPulse className="h-5 w-5 animate-beat" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-white">
            Swasth<span className="text-primary-500">Gram</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => handleNav(l.path)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(l.path)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {t(l.key)}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="btn-ghost px-2.5 py-2"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden text-xs font-semibold sm:inline">
                {language.toUpperCase()}
              </span>
            </button>
            {langOpen && (
              <div
                className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-card-hover ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
                onMouseLeave={() => setLangOpen(false)}
              >
                {[
                  { code: 'en', label: 'English' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'hi', label: 'हिन्दी' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as 'en' | 'te' | 'hi');
                      setLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                      language === l.code
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="btn-ghost px-2.5 py-2"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Emergency */}
          <a href="tel:108" className="btn-danger hidden px-3.5 py-2 sm:inline-flex">
            <Phone className="h-4 w-4" />
            <span className="text-xs font-bold">108</span>
          </a>

          {/* Auth */}
          {session ? (
            <div className="hidden items-center gap-1 lg:flex">
              {profile?.role === 'admin' && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="btn-ghost px-2.5 py-2"
                  aria-label="Admin"
                >
                  <ShieldCheck className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleNav('/dashboard')}
                className="btn-ghost px-2.5 py-2"
                aria-label="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
              <button
                onClick={() => signOut()}
                className="btn-ghost px-2.5 py-2"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <button
                onClick={() => handleNav('/login')}
                className="btn-secondary px-4 py-2 text-xs"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className="btn-primary px-4 py-2 text-xs"
              >
                {t('nav.signup')}
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="btn-ghost px-2.5 py-2 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => handleNav(l.path)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  isActive(l.path)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {t(l.key)}
              </button>
            ))}
            <a
              href="tel:108"
              className="btn-danger mt-2 w-full"
            >
              <Phone className="h-4 w-4" />
              {t('common.callAmbulance')} (108)
            </a>
            {session ? (
              <>
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="btn-secondary mt-2 w-full"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {t('nav.admin')}
                  </button>
                )}
                <button
                  onClick={() => signOut()}
                  className="btn-secondary mt-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="btn-secondary flex-1"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className="btn-primary flex-1"
                >
                  {t('nav.signup')}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
