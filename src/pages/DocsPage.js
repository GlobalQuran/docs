import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DocsPage = () => {
  useEffect(() => {
    // Load Stoplight Elements if not already loaded
    if (!window.customElements.get('elements-api')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@stoplight/elements/web-components.min.js';
      script.async = true;
      script.onload = () => {
        console.log('Stoplight Elements loaded successfully');
      };
      script.onerror = (error) => {
        console.error('Failed to load Stoplight Elements:', error);
      };
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/@stoplight/elements/styles.min.css';
      link.onload = () => {
        console.log('Stoplight Elements CSS loaded successfully');
      };    
      link.onerror = (error) => {
        console.error('Failed to load Stoplight Elements CSS:', error);
      };
      document.head.appendChild(link);

      // Add custom styles for documentation
      const style = document.createElement('style');
      style.textContent = `
        .sl-elements .sl-pt-8 {
          padding-top: 0px;
        }
        .sl-elements-api > div:first-child {
          --color-canvas-100: #fff;
        }
        .docs-container {
          min-height: 80vh;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="row" id="top">
      <div className="col-md-12">
        <h1>API Documentation</h1>
        <p className="lead">
          Complete API documentation for GlobalQuran.com services. Learn how to integrate 
          Quran data, translations, and audio recitations into your applications.
        </p>
        
        <div className="alert alert-info">
          <h4>Interactive Examples</h4>
          <p>Explore our comprehensive examples with source code and live demos side by side.</p>
          <div className="row">
            <div className="col-md-6">
              <h5>Basic Examples:</h5>
              <ul>
                <li><Link to="/examples/quran-complete">Complete Quran Data</Link> - Fetch complete Quran text with translations</li>
                <li><Link to="/examples/quran-by-surah">Quran by Surah</Link> - Retrieve specific chapters</li>
                <li><Link to="/examples/quran-by-ayah">Quran by Ayah</Link> - Fetch individual verses</li>
                <li><Link to="/examples/quran-list-translation">List Translations</Link> - Available translations</li>
                <li><Link to="/examples/quran-list">Quran List</Link> - All available resources</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5>Advanced Examples:</h5>
              <ul>
                <li><Link to="/examples/quran-list-recitors">List Recitors</Link> - Audio recitors and formats</li>
                <li><Link to="/examples/quran-by-juz">Quran by Juz</Link> - Access by Juz (Para)</li>
                <li><Link to="/examples/quran-by-page">Quran by Page</Link> - Retrieve by page numbers</li>
                <li><Link to="/examples/quran-all-in-one-request">All-in-One Request</Link> - Comprehensive example</li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Link to="/examples/quran-complete" className="btn btn-primary">
              <i className="fas fa-play"></i> Start with Basic Example
            </Link>
          </div>
        </div>

        <div className="docs-container">
          <elements-api
            apiDescriptionUrl={`${process.env.PUBLIC_URL}/docs-assets/api.yaml`}
            router="hash"
            style={{ height: '80vh', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div className="alert alert-success" style={{ marginTop: '20px' }}>
          <h4>Need Help?</h4>
          <p>
            If you need assistance with the API or have questions about implementation:
          </p>
          <ul>
            <li><strong>GitHub Issues:</strong> <a href="https://github.com/GlobalQuran/site/issues" target="_blank" rel="noopener noreferrer">Report bugs or request features</a></li>
            <li><strong>Contact Us:</strong> <a href="https://blog.globalquran.com/contact-us/" target="_blank" rel="noopener noreferrer">Get in touch</a></li>
            <li><strong>Blog:</strong> <a href="https://blog.globalquran.com/" target="_blank" rel="noopener noreferrer">Latest updates and tutorials</a></li>
          </ul>
        </div>

        <hr />

        <footer>
          <ul className="list-unstyled list-inline pull-right">
            <li><a href="https://github.com/GlobalQuran/site/issues">Feedback</a></li>
            <li><a href="https://github.com/GlobalQuran/site/issues">Report Bug</a></li>
            <li><a href="https://github.com/GlobalQuran/site/issues">Help</a></li>
            <li><a href="https://blog.globalquran.com/">Blog</a></li>
            <li><a href="https://blog.globalquran.com/about-us/">About us</a></li>
            <li><a href="https://blog.globalquran.com/contact-us/">Contact us</a></li>
          </ul>
          <p>© <a href="https://globalquran.com/">GlobalQuran.com</a> 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default DocsPage; 