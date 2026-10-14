import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Attach the current session token to API requests so protected backend routes
// can verify the authenticated account. Login and registration stay public.
const nativeFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const requestUrl = typeof input === 'string' || input instanceof URL ? String(input) : input.url;
  const isApiRequest = requestUrl.includes('/api/');
  const isPublicAuth = /\/api\/auth\/(login|register)(\?|$)/.test(requestUrl);
  if (!isApiRequest || isPublicAuth) return nativeFetch(input, init);

  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
  const token = localStorage.getItem('pathashala_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return nativeFetch(input, { ...init, headers });
};

createRoot(document.getElementById('root')!).render(<App />);
