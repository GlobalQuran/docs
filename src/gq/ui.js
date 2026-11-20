import React, { useState } from 'react';
import { useTheme } from './theme';
export { KEYS_URL } from './auth';

export const API = 'https://api.globalquran.com';
export const AUDIO = 'https://audio.globalquran.com';
export const GITHUB = 'https://github.com/GlobalQuran';

export const ThemeToggle = () => {
  const { night, toggle } = useTheme();
  return (
    <button type="button" className="ib ibtn" onClick={toggle} aria-label={night ? 'Switch to day' : 'Switch to night'} title={night ? 'Day' : 'Night'}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {night ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
          </>
        ) : (
          <path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z" />
        )}
      </svg>
    </button>
  );
};

export function copyText(text, done) {
  const fin = () => done && done();
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(fin, fin);
  else {
    const t = document.createElement('textarea');
    t.value = text; document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(t); fin();
  }
}

export const CopyButton = ({ text, label = 'Copy', primary, className = '' }) => {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className={`btn s ${primary ? 'p' : ''} ${className}`}
      onClick={() => copyText(text, () => { setOk(true); setTimeout(() => setOk(false), 1600); })}>
      {ok ? 'Copied' : label}
    </button>
  );
};

/** A code block with a caption and a copy button. `text` is what gets copied and shown. */
export const Code = ({ text, caption, small }) => (
  <div>
    {caption !== undefined && (
      <div className="cap"><span>{caption}</span><CopyButton text={text} /></div>
    )}
    <div className="code" style={small ? { fontSize: 12 } : undefined}>{text}</div>
  </div>
);

export const Seg = ({ options, value, onChange }) => (
  <span className="seg" role="group">
    {options.map((o) => {
      const v = typeof o === 'string' ? o : o.value;
      const l = typeof o === 'string' ? o : o.label;
      return <span key={v} className={v === value ? 'on' : ''} role="button" tabIndex={0}
        onClick={() => onChange(v)} onKeyDown={(e) => { if (e.key === 'Enter') onChange(v); }}>{l}</span>;
    })}
  </span>
);

export const Field = ({ label, children }) => (
  <div><div className="lbl">{label}</div>{children}</div>
);

export const Page = ({ children, className = '' }) => (
  <div className={`gq-new ${className}`}>{children}</div>
);
