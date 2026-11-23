import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../gq/ui';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    subject: new URLSearchParams(window.location.search).get('subject') || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef(null);
  
  // Get reCAPTCHA site key from environment variable
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LePCE4rAAAAAGSblsacbm8Zi-GhmwkkZS9-XfO9'; // public site key (the secret is in the gq-contact Worker)


  // Load reCAPTCHA v2 script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaLoaded(true);
      document.head.appendChild(script);
      
      return () => {
        // Cleanup if component unmounts
        const existingScript = document.querySelector(`script[src="${script.src}"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    } else if (window.grecaptcha) {
      setRecaptchaLoaded(true);
    }
  }, []);

  // Render reCAPTCHA when loaded
  useEffect(() => {
    if (recaptchaLoaded && recaptchaRef.current && RECAPTCHA_SITE_KEY && !showThankYou) {
      // Clear any existing reCAPTCHA
      recaptchaRef.current.innerHTML = '';
      
      // Add reCAPTCHA div with data-sitekey
      const recaptchaDiv = document.createElement('div');
      recaptchaDiv.className = 'g-recaptcha';
      recaptchaDiv.setAttribute('data-sitekey', RECAPTCHA_SITE_KEY);
      recaptchaRef.current.appendChild(recaptchaDiv);
      
      // Render the reCAPTCHA
      if (window.grecaptcha && window.grecaptcha.render) {
        try {
          window.grecaptcha.render(recaptchaDiv);
        } catch (error) {
          console.error('Error rendering reCAPTCHA:', error);
        }
      }
    }
  }, [recaptchaLoaded, showThankYou, RECAPTCHA_SITE_KEY]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Get reCAPTCHA response
      let recaptchaToken = '';
      if (typeof window !== 'undefined' && window.grecaptcha) {
        recaptchaToken = window.grecaptcha.getResponse();
        
        if (!recaptchaToken) {
          alert('Please complete the reCAPTCHA verification.');
          return;
        }
      } else {
        alert('reCAPTCHA not loaded. Please refresh the page and try again.');
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowThankYou(true);
        setFormData({
          firstName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // Reset reCAPTCHA
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Sorry, there was an error sending your message: ${error.message}. Please try again later.`);
      // Reset reCAPTCHA on error
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    setShowThankYou(false);
    // reCAPTCHA will be re-rendered by the useEffect
  };

  const f = (name, label, props = {}) => (
    <div>
      <label className="lbl" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="inp" value={formData[name]} onChange={handleInputChange} {...props} />
    </div>
  );
  return (
    <Page>
      <div className="in" style={{ paddingTop: 40 }}>
        <div className="eyebrow">Contact</div>
        <h1 className="h1" style={{ fontSize: 38, margin: '12px 0' }}>Talk to us.</h1>
        <p className="lead" style={{ maxWidth: 640 }}>Questions about the API, a bug, a translation, or a partnership. A person reads every message.</p>
      </div>
      <div className="in twocol" style={{ paddingTop: 24 }}>
        <div style={{ flex: '1 1 520px', minWidth: 0 }}>
          {showThankYou ? (
            <div className="frame" style={{ padding: 30, textAlign: 'center' }}>
              <div className="h2">Thank you, message sent.</div>
              <p className="mute">We will reply by email as soon as we can.</p>
              <button className="btn p" onClick={handleSendAnother}>Send another</button>
            </div>
          ) : (
            <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="grid g2" style={{ gap: 14 }}>
                {f('firstName', 'Your name', { required: true, placeholder: 'Name' })}
                {f('email', 'Email', { required: true, type: 'email', placeholder: 'you@example.com' })}
              </div>
              <div className="grid g2" style={{ gap: 14 }}>
                {f('phone', 'Phone (optional)', { type: 'tel' })}
                <div>
                  <label className="lbl" htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" className="inp" value={formData.subject} onChange={handleInputChange} required>
                    <option value="">Select a subject</option>
                    {['General Inquiry', 'API Support', 'Bug Report', 'Feature Request', 'Partnership', 'Donation/Support', 'Other'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="lbl" htmlFor="message">Message</label>
                <textarea id="message" name="message" className="inp" value={formData.message} onChange={handleInputChange} required placeholder="How can we help?" />
              </div>
              <div ref={recaptchaRef} />
              <div><button type="submit" className="btn p" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send message'}</button></div>
            </form>
          )}
        </div>
        <div style={{ flex: '0 0 340px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a className="mini" href="mailto:info@globalquran.com"><div className="ic">@</div><div><b>Email</b><span>info@globalquran.com</span></div></a>
          <a className="mini" href="https://github.com/GlobalQuran" target="_blank" rel="noopener noreferrer"><div className="ic">GH</div><div><b>GitHub</b><span>Report a bug or send a fix</span></div></a>
          <a className="mini" href="/api"><div className="ic">{'{ }'}</div><div><b>API help</b><span>Read the docs first, then write to us</span></div></a>
          <a className="mini" href="/donate"><div className="ic">♥</div><div><b>Support us</b><span>Keeps the Quran free</span></div></a>
        </div>
      </div>
    </Page>
  );
};

export default ContactPage;
