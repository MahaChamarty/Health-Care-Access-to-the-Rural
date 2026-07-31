import { HeartPulse, Target, Eye, Users, ShieldCheck, Activity } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function About() {
  const { t } = useApp();
  return (
    <div className="section py-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
          <HeartPulse className="h-7 w-7 animate-beat" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-900 md:text-4xl dark:text-white">
          {t('home.about.title')}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          SwasthGram is a rural healthcare companion built to help villagers make
          quick, informed health decisions. Many rural families live far from the
          nearest doctor and are unsure whether a symptom is minor or serious.
          Our tool offers a simple symptom checker, a clear risk level, and a
          directory of nearby hospitals — so people know when home care is enough
          and when to seek help immediately.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {[
          {
            icon: Target,
            title: 'Our Mission',
            desc: 'Bring basic health guidance to every village, in their own language.',
          },
          {
            icon: Eye,
            title: 'Our Vision',
            desc: 'No one should lose a life because they did not know when to seek care.',
          },
          {
            icon: Users,
            title: 'Who We Serve',
            desc: 'Rural households, community health workers, and local clinics.',
          },
        ].map((c) => (
          <div key={c.title} className="card p-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
              <c.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-bold text-slate-800 dark:text-white">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-amber-50 p-6 text-sm leading-relaxed text-amber-800 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-800">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-5 w-5" /> Important
        </div>
        <p className="mt-2">
          SwasthGram provides a preliminary risk assessment only — not a medical
          diagnosis. Always consult a qualified doctor for serious or persistent
          symptoms. In an emergency, call 108 immediately.
        </p>
      </div>
    </div>
  );
}
