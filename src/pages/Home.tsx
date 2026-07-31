import { useState } from 'react';
import {
  Stethoscope,
  MapPin,
  ShieldAlert,
  Activity,
  Languages,
  Mic,
  Moon,
  FileDown,
  Bell,
  Phone,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Building2,
  Ambulance,
  HandHeart,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useNavigate } from '@/lib/router';

export default function Home() {
  const { t } = useApp();
  const navigate = useNavigate();

  const features = [
    {
      icon: Stethoscope,
      title: 'Symptom Risk Check',
      desc: 'Select your symptoms and get a preliminary risk assessment in seconds.',
    },
    {
      icon: Building2,
      title: 'Nearby Hospitals',
      desc: 'Find government and private hospitals near you with directions and phone numbers.',
    },
    {
      icon: ShieldAlert,
      title: 'Emergency Alerts',
      desc: 'High-risk symptoms trigger immediate warnings and ambulance contacts.',
    },
    {
      icon: Languages,
      title: 'Multi-Language',
      desc: 'Use the app in English, Telugu, or Hindi — built for rural users.',
    },
    {
      icon: Mic,
      title: 'Voice Input',
      desc: 'Speak your symptoms instead of typing — helpful for low-literacy users.',
    },
    {
      icon: FileDown,
      title: 'Download Report',
      desc: 'Save or print your symptom report to take to the doctor.',
    },
    {
      icon: Bell,
      title: 'Medicine Reminders',
      desc: 'Set reminders so you never miss a dose.',
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      desc: 'Comfortable to read day or night, on any phone.',
    },
  ];

  const steps = [
    {
      icon: HandHeart,
      title: 'Tell Us How You Feel',
      desc: 'Enter your details and pick your symptoms from simple cards.',
    },
    {
      icon: Activity,
      title: 'Get Risk Assessment',
      desc: 'Our system checks your symptoms and tells you if the risk is low or high.',
    },
    {
      icon: Ambulance,
      title: 'Act On The Advice',
      desc: 'For low risk, try home remedies. For high risk, find a hospital and call for help.',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="section py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="chip bg-primary-50 text-primary-700 ring-1 ring-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:ring-primary-800">
                <HeartPulse className="h-3.5 w-3.5" />
                Rural Healthcare Initiative
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white">
                {t('home.hero.title')}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {t('home.hero.subtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/predict')}
                  className="btn-primary"
                >
                  {t('home.hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('/hospitals')}
                  className="btn-secondary"
                >
                  <MapPin className="h-4 w-4" />
                  {t('home.hero.secondary')}
                </button>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
                {['Free to use', 'Works on any phone', '3 languages'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Illustration card */}
            <div className="relative animate-fade-in-up [animation-delay:150ms]">
              <div className="card relative overflow-hidden p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-100/60 blur-2xl dark:bg-primary-900/30" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary-100/60 blur-2xl dark:bg-secondary-900/30" />
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-card-hover">
                      <HeartPulse className="h-14 w-14 animate-beat" />
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                    {[
                      { icon: Stethoscope, label: 'Check' },
                      { icon: Activity, label: 'Assess' },
                      { icon: Ambulance, label: 'Act' },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700"
                      >
                        <s.icon className="mx-auto h-6 w-6 text-primary-500" />
                        <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 top-10 hidden animate-float md:block">
                <div className="card flex items-center gap-2 px-4 py-3">
                  <ShieldAlert className="h-5 w-5 text-danger-500" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Emergency ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('home.about.title')}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            In many rural villages, the nearest doctor can be hours away and
            families are unsure whether a symptom is minor or serious. SwasthGram
            helps bridge that gap with a simple symptom checker, clear risk
            levels, and a directory of nearby hospitals — so people know when to
            rest at home and when to seek care immediately.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Stethoscope, label: '17+ diseases mapped' },
              { icon: Building2, label: '15+ hospitals listed' },
              { icon: Languages, label: '3 languages' },
            ].map((s) => (
              <div
                key={s.label}
                className="card flex items-center justify-center gap-2 p-4 text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                <s.icon className="h-5 w-5 text-primary-500" />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('home.features.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
            Everything a rural household needs to make a quick, informed health
            decision.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="card group p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/40 dark:text-primary-300">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16 dark:bg-slate-900/50">
        <div className="section">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('home.how.title')}
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-card">
                  <s.icon className="h-8 w-8" />
                </div>
                <div className="mx-auto mt-4 grid h-7 w-7 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                  {i + 1}
                </div>
                <h3 className="mt-3 text-lg font-bold text-slate-800 dark:text-white">
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section py-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('home.contact.title')}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Questions or feedback? Reach out and we'll get back to you.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="card mt-8 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {sent ? (
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary-500" />
          <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
            Thank you! Your message has been received.
          </p>
          <button
            onClick={() => setSent(false)}
            className="btn-secondary mt-4"
          >
            Send another
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" required placeholder="Your name" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="Your phone" />
            </div>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              className="input min-h-[120px] resize-y"
              required
              placeholder="How can we help?"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <Phone className="h-4 w-4" />
            Send Message
          </button>
        </div>
      )}
    </form>
  );
}
