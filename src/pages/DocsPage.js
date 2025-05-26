import React, { useEffect } from 'react';

const DocsPage = () => {
  useEffect(() => {
    // Load Stoplight Elements if not already loaded
    if (!window.customElements.get('elements-api')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@stoplight/elements/web-components.min.js';
      script.async = true;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/@stoplight/elements/styles.min.css';
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
          <h4>Quick Links</h4>
          <div className="row">
            <div className="col-md-6">
              <h5>Common Examples:</h5>
              <ul>
                <li><a href="/docs-assets/examples/quran-complete.html" target="_blank" rel="noopener noreferrer">Complete Quran Data</a></li>
                <li><a href="/docs-assets/examples/quran-by-surah.html" target="_blank" rel="noopener noreferrer">Quran by Surah</a></li>
                <li><a href="/docs-assets/examples/quran-by-ayah.html" target="_blank" rel="noopener noreferrer">Quran by Ayah</a></li>
                <li><a href="/docs-assets/examples/quran-list-translation.html" target="_blank" rel="noopener noreferrer">List Translations</a></li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5>Advanced Examples:</h5>
              <ul>
                <li><a href="/docs-assets/examples/quran-list-recitors.html" target="_blank" rel="noopener noreferrer">List Recitors</a></li>
                <li><a href="/docs-assets/examples/quran-by-juz.html" target="_blank" rel="noopener noreferrer">Quran by Juz</a></li>
                <li><a href="/docs-assets/examples/quran-by-page.html" target="_blank" rel="noopener noreferrer">Quran by Page</a></li>
                <li><a href="/docs-assets/examples/quran-all-in-one-request.html" target="_blank" rel="noopener noreferrer">All-in-One Request</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="docs-container">
          <elements-api
            apiDescriptionUrl="/docs-assets/api.yaml"
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