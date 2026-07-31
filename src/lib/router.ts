import { useEffect, useState, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'predict' }
  | { name: 'hospitals' }
  | { name: 'dashboard' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'forgot' }
  | { name: 'admin' };

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  switch (h) {
    case 'predict':
      return { name: 'predict' };
    case 'hospitals':
      return { name: 'hospitals' };
    case 'dashboard':
      return { name: 'dashboard' };
    case 'about':
      return { name: 'about' };
    case 'contact':
      return { name: 'contact' };
    case 'login':
      return { name: 'login' };
    case 'signup':
      return { name: 'signup' };
    case 'forgot':
      return { name: 'forgot' };
    case 'admin':
      return { name: 'admin' };
    default:
      return { name: 'home' };
  }
}

export function navigate(path: string) {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function useNavigate() {
  return useCallback((path: string) => navigate(path), []);
}
