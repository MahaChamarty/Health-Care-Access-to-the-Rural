import { Phone } from 'lucide-react';
import { AppProvider, useApp } from '@/lib/context';
import { useRoute } from '@/lib/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Predict from '@/pages/Predict';
import Hospitals from '@/pages/Hospitals';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';

function Pages() {
  const route = useRoute();
  switch (route.name) {
    case 'home':
      return <Home />;
    case 'predict':
      return <Predict />;
    case 'hospitals':
      return <Hospitals />;
    case 'dashboard':
      return <Dashboard />;
    case 'about':
      return <About />;
    case 'contact':
      return <Contact />;
    case 'login':
    case 'signup':
    case 'forgot':
      return <Auth />;
    case 'admin':
      return <Admin />;
    default:
      return <Home />;
  }
}

function EmergencyFab() {
  return (
    <a
      href="tel:108"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-danger-500 to-danger-600 px-5 py-3.5 font-bold text-white shadow-card-hover transition-transform hover:scale-105 animate-pulse-soft"
      aria-label="Call ambulance"
    >
      <Phone className="h-5 w-5" />
      <span className="hidden text-sm sm:inline">Emergency 108</span>
    </a>
  );
}

function Shell() {
  const { loading } = useApp();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
          <p className="mt-4 text-sm text-slate-500">Loading SwasthGram...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Pages />
      </main>
      <Footer />
      <EmergencyFab />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
