import { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function Contact() {
  const { t } = useApp();
  const [sent, setSent] = useState(false);

  return (
    <div className="section py-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-secondary-500 to-primary-500 text-white">
          <MessageSquare className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-slate-900 md:text-4xl dark:text-white">
          {t('home.contact.title')}
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Questions, feedback, or want to add a hospital for your village? Reach
          out and we'll respond as soon as we can.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, label: 'Emergency', value: '108 (Ambulance)' },
            { icon: Mail, label: 'Email', value: 'help@swasthgram.in' },
            { icon: MapPin, label: 'Location', value: 'Rural Health Initiative, India' },
          ].map((c) => (
            <div key={c.label} className="card flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {c.label}
                </p>
                <p className="font-semibold text-slate-800 dark:text-white">
                  {c.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          {sent ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-primary-500" />
              <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-white">
                Thank you! Your message has been received.
              </p>
              <button onClick={() => setSent(false)} className="btn-secondary mt-4">
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid gap-4"
            >
              <div>
                <label className="label">Name</label>
                <input className="input" required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input min-h-[120px] resize-y" required />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
