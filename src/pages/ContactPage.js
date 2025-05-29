import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef(null);
  
  // Get reCAPTCHA site key from environment variable
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Fallback to test key

  // CSS styles for dropdown fix
  const dropdownStyles = `
    .form-control select option {
      padding: 8px 12px;
      background-color: white;
      color: #333;
      border: none;
    }
    .form-control select {
      background-color: white !important;
      background-image: none !important;
    }
    .form-control select:focus {
      outline: none;
      border-color: #66afe9;
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);
    }
  `;

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

      const response = await fetch('https://us-central1-globalquran-prod.cloudfunctions.net/sendContactEmail', {
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

  if (showThankYou) {
    return (
      <>
        {/* Inject dropdown styles */}
        <style dangerouslySetInnerHTML={{ __html: dropdownStyles }} />
        
        {/* Thank You Section */}
        <div className="jumbotron" style={{ background: 'linear-gradient(135deg, #2c5530 0%, #1e3a21 100%)', color: 'white', textAlign: 'center', padding: '80px 0' }}>
          <div className="container">
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#b99c45', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                marginBottom: '20px'
              }}>
                <i className="fas fa-check" style={{ fontSize: '2.5em', color: 'white' }}></i>
              </div>
            </div>
            <h1 style={{ fontSize: '3em', marginBottom: '20px', fontWeight: 'bold' }}>
              Message Received!
            </h1>
            <p style={{ fontSize: '1.4em', marginBottom: '30px', opacity: '0.9' }}>
              Thank you for reaching out. We'll respond to your inquiry as soon as possible.
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSendAnother}
              style={{ padding: '12px 30px', fontSize: '1.1em' }}
            >
              <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
              Send Another Message
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* Inject dropdown styles */}
      <style dangerouslySetInnerHTML={{ __html: dropdownStyles }} />
      
      {/* Hero Section */}
      <div className="jumbotron" style={{ background: 'linear-gradient(135deg, #b99c45 0%, #9b833a 100%)', color: 'white', textAlign: 'center', padding: '60px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5em', marginBottom: '20px', fontWeight: 'bold' }}>
            <i className="fas fa-envelope" style={{ marginRight: '15px' }}></i>
            Get in Touch
          </h1>
          <p style={{ fontSize: '1.4em', marginBottom: '0', opacity: '0.9' }}>
            Have questions about our Quran platform? We're here to help you spread the divine message
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
        <div className="row">
          {/* Contact Information */}
          <div className="col-md-4">
            <h2 style={{ color: '#2c5530', marginBottom: '30px' }}>
              <i className="fas fa-info-circle" style={{ color: '#b99c45', marginRight: '10px' }}></i>
              Contact Information
            </h2>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '15px',
                  border: '2px solid #b99c45'
                }}>
                  <i className="fas fa-envelope" style={{ color: '#b99c45', fontSize: '1.2em' }}></i>
                </div>
                <div>
                  <h4 style={{ color: '#2c5530', marginBottom: '8px', fontSize: '1.2em' }}>Email</h4>
                  <p style={{ color: '#666', margin: '0', fontSize: '1em' }}>info@globalquran.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '15px',
                  border: '2px solid #b99c45'
                }}>
                  <i className="fas fa-headset" style={{ color: '#b99c45', fontSize: '1.2em' }}></i>
                </div>
                <div>
                  <h4 style={{ color: '#2c5530', marginBottom: '8px', fontSize: '1.2em' }}>Support</h4>
                  <p style={{ color: '#666', margin: '0', fontSize: '1em' }}>Community support via GitHub</p>
                  <p style={{ color: '#666', margin: '0', fontSize: '0.9em' }}>Response within 24-48 hours</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '15px',
                  border: '2px solid #b99c45'
                }}>
                  <i className="fas fa-code" style={{ color: '#b99c45', fontSize: '1.2em' }}></i>
                </div>
                <div>
                  <h4 style={{ color: '#2c5530', marginBottom: '8px', fontSize: '1.2em' }}>Development</h4>
                  <p style={{ color: '#666', margin: '0', fontSize: '1em' }}>
                    <a href="https://github.com/GlobalQuran/site" target="_blank" rel="noopener noreferrer" style={{ color: '#b99c45' }}>
                      GitHub Repository
                    </a>
                  </p>
                  <p style={{ color: '#666', margin: '0', fontSize: '0.9em' }}>Open source contributions welcome</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-8">
            <div style={{ background: '#f8f9fa', padding: '40px', borderRadius: '10px', borderLeft: '5px solid #b99c45' }}>
              <h2 style={{ color: '#2c5530', marginBottom: '25px' }}>
                <i className="fas fa-paper-plane" style={{ color: '#b99c45', marginRight: '10px' }}></i>
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6" style={{ marginBottom: '20px' }}>
                    <label htmlFor="firstName" style={{ color: '#2c5530', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                      Name <span style={{ color: '#d32f2f' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                      style={{ padding: '12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-6" style={{ marginBottom: '20px' }}>
                    <label htmlFor="email" style={{ color: '#2c5530', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                      Email <span style={{ color: '#d32f2f' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      style={{ padding: '12px', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6" style={{ marginBottom: '20px' }}>
                    <label htmlFor="phone" style={{ color: '#2c5530', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                      Phone <span style={{ color: '#666', fontSize: '12px' }}>(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      style={{ padding: '12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="col-md-6" style={{ marginBottom: '20px' }}>
                    <label htmlFor="subject" style={{ color: '#2c5530', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                      Subject <span style={{ color: '#d32f2f' }}>*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      style={{ 
                        padding: '12px', 
                        fontSize: '14px',
                        height: '46px',
                        lineHeight: '1.4',
                        background: 'white',
                        backgroundImage: 'none',
                        appearance: 'auto',
                        WebkitAppearance: 'menulist',
                        MozAppearance: 'menulist',
                        verticalAlign: 'middle',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        paddingLeft: '12px',
                        paddingRight: '30px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        color: '#555',
                        overflow: 'visible'
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="API Support">API Support</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Donation/Support">Donation/Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label htmlFor="message" style={{ color: '#2c5530', fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                    Message <span style={{ color: '#d32f2f' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength="10"
                    placeholder="Please describe your inquiry in detail (minimum 10 characters)..."
                    style={{ padding: '12px', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                {/* reCAPTCHA v2 Widget */}
                <div style={{ marginBottom: '25px' }}>
                  {recaptchaLoaded && RECAPTCHA_SITE_KEY ? (
                    <div ref={recaptchaRef}></div>
                  ) : (
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Loading security verification...
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting || !recaptchaLoaded}
                  style={{ 
                    padding: '12px 30px', 
                    fontSize: '1.1em',
                    opacity: isSubmitting || !recaptchaLoaded ? 0.7 : 1 
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="row" style={{ marginTop: '50px' }}>
          <div className="col-md-12">
            <div style={{ background: 'linear-gradient(135deg, #2c5530 0%, #1e3a21 100%)', color: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.8em' }}>
                <i className="fas fa-heart" style={{ marginRight: '10px' }}></i>
                We Value Your Feedback
              </h3>
              <p style={{ fontSize: '1.1em', lineHeight: '1.7', marginBottom: '20px', opacity: '0.95' }}>
                Your input helps us improve GlobalQuran.com and serve the Muslim community better. 
                Whether you have technical questions, suggestions for new features, or just want to share your experience, 
                we'd love to hear from you.
              </p>
              <p style={{ fontSize: '1em', margin: '0', opacity: '0.9', fontStyle: 'italic' }}>
                "And whoever saves a life, it is as if he has saved all of mankind." - Quran 5:32
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage; 