import { useState } from 'react';
import { useApp } from '@/lib/context';
import { useNavigate, useRoute } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import { HeartPulse, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Auth() {
  const route = useRoute();
  const { t } = useApp();
  const navigate = useNavigate();
  const mode =
    route.name === 'signup'
      ? 'signup'
      : route.name === 'forgot'
        ? 'forgot'
        : 'login';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setInfo('Account created! You are now signed in.');
        navigate('/dashboard');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setInfo('Password reset link sent to your email.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const titles: Record<typeof mode, string> = {
    login: t('auth.login.title'),
    signup: t('auth.signup.title'),
    forgot: t('auth.forgot.title'),
  };

  return (
    <div className="section flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-card">
            <HeartPulse className="h-7 w-7 animate-beat" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
            {titles[mode]}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="card p-6">
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="label">{t('auth.name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="label">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="input pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          {mode !== 'forgot' && (
            <div className="mb-4">
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="input pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700 dark:bg-danger-900/30 dark:text-danger-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-success-50 p-3 text-sm text-success-700 dark:bg-success-900/30 dark:text-success-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {info}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? t('auth.loginBtn')
                : mode === 'signup'
                  ? t('auth.signupBtn')
                  : t('auth.sendReset')}
          </button>

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => navigate('/forgot')}
              className="mt-3 block w-full text-center text-xs font-medium text-secondary-600 hover:underline dark:text-secondary-400"
            >
              {t('auth.forgotLink')}
            </button>
          )}
        </form>

        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          {mode === 'login' ? (
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('auth.noAccount')}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('auth.hasAccount')}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
