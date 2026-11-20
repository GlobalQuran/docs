import { useEffect, useState } from 'react';

// Same behaviour as the Quran Anywhere reader: follow the system until the visitor picks day or night with the icon.
const KEY = 'gq_theme';
const stored = () => {
  try { const v = localStorage.getItem(KEY); return v === 'day' || v === 'night' ? v : 'auto'; } catch (e) { return 'auto'; }
};
const systemDark = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;
const isNight = (p) => p === 'night' || (p === 'auto' && systemDark());

export function applyTheme(p = stored()) {
  const night = isNight(p);
  document.documentElement.classList.toggle('night', night);
  document.documentElement.style.colorScheme = night ? 'dark' : 'light';
}

export function initTheme() {
  applyTheme();
  if (typeof matchMedia !== 'undefined') {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', () => applyTheme());
  }
}

export function useTheme() {
  const [pref, setPref] = useState(stored());
  const [, tick] = useState(0);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => tick((n) => n + 1);
    if (mq.addEventListener) mq.addEventListener('change', on);
    return () => { if (mq.removeEventListener) mq.removeEventListener('change', on); };
  }, []);
  const night = isNight(pref);
  const toggle = () => {
    const next = night ? 'day' : 'night';
    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
    setPref(next);
    applyTheme(next);
  };
  return { night, toggle };
}
