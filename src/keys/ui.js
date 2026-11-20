import React, { useEffect, useState } from 'react';
import { getMode, setModeStored } from './data';

export const toast = (msg, bad) => {
  const d = document.createElement('div');
  d.textContent = msg; d.setAttribute('role', 'status');
  d.style.cssText = `position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;padding:10px 18px;border-radius:10px;font:600 14px sans-serif;color:#fff;background:${bad ? '#a33' : '#1d5f2f'};box-shadow:0 6px 20px rgba(0,0,0,.3)`;
  document.body.appendChild(d); setTimeout(() => d.remove(), 2600);
};
export const notifyError = (m) => toast(m, true);
export const notifySuccess = (m) => toast(m, false);

export const Spinner = ({ text }) => <div className="k-muted" style={{ padding: '3rem 0', textAlign: 'center' }}>{text || 'Loading…'}</div>;

export const KCopy = ({ text, primary, small, disabled, label = 'Copy' }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 1500);
  };
  return <button type="button" className={`k-btn${primary ? ' p' : ''}${small ? ' s' : ''}`} onClick={copy} disabled={disabled}>{done ? 'Copied' : label}</button>;
};

export function useMode() {
  const [mode, setMode] = useState(getMode());
  useEffect(() => {
    const on = () => setMode(getMode());
    window.addEventListener('gq-mode', on);
    return () => window.removeEventListener('gq-mode', on);
  }, []);
  return [mode, (m) => { setModeStored(m); window.dispatchEvent(new Event('gq-mode')); }];
}
