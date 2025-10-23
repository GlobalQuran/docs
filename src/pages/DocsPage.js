import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const DocsPage = () => {
  useEffect(() => {
    // Load Stoplight Elements if not already loaded
    if (!window.customElements.get('elements-api')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@stoplight/elements/web-components.min.js';
      script.async = true;
      script.onload = () => {
        console.log('Stoplight Elements loaded successfully');
        // Test if the API file is accessible
        const apiUrl = `${window.location.origin}/docs-assets/api.yaml`;
        console.log('Trying to load API from:', apiUrl);
        fetch(apiUrl)
          .then(response => {
            console.log('API file response status:', response.status);
            if (!response.ok) {
              console.error('API file not accessible:', response.status, response.statusText);
            }
            return response.text();
          })
          .then(text => {
            console.log('API file loaded successfully, size:', text.length);
          })
          .catch(error => {
            console.error('Error loading API file:', error);
            // Show fallback if API file can't be loaded
            setTimeout(() => {
              const fallback = document.getElementById('api-fallback');
              const elementsApi = document.querySelector('elements-api');
              if (fallback && elementsApi) {
                elementsApi.style.display = 'none';
                fallback.style.display = 'block';
              }
            }, 3000);
          });
        
        // Also listen for Stoplight Elements errors
        setTimeout(() => {
          const elementsApi = document.querySelector('elements-api');
          if (elementsApi) {
            elementsApi.addEventListener('error', (event) => {
              console.error('Stoplight Elements error:', event);
              const fallback = document.getElementById('api-fallback');
              if (fallback) {
                elementsApi.style.display = 'none';
                fallback.style.display = 'block';
              }
            });
          }
        }, 1000);
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
        .example-link {
          color: #007bff;
          font-weight: 600;
          text-decoration: none;
        }
        .example-link:hover {
          color: #0056b3;
          text-decoration: underline;
        }
        .example-description {
          color: #6c757d;
          font-weight: normal;
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
                <li><Link to="/examples/quran-complete" className="example-link">Complete Quran Data</Link> <span className="example-description">- Fetch complete Quran text with translations</span></li>
                <li><Link to="/examples/quran-by-surah" className="example-link">Quran by Surah</Link> <span className="example-description">- Retrieve specific chapters</span></li>
                <li><Link to="/examples/quran-by-ayah" className="example-link">Quran by Ayah</Link> <span className="example-description">- Fetch individual verses</span></li>
                <li><Link to="/examples/quran-list-translation" className="example-link">List Translations</Link> <span className="example-description">- Available translations</span></li>
                <li><Link to="/examples/quran-list" className="example-link">Quran List</Link> <span className="example-description">- All available resources</span></li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5>Advanced Examples:</h5>
              <ul>
                <li><Link to="/examples/quran-list-recitors" className="example-link">List Recitors</Link> <span className="example-description">- Audio recitors and formats</span></li>
                <li><Link to="/examples/quran-by-juz" className="example-link">Quran by Juz</Link> <span className="example-description">- Access by Juz (Para)</span></li>
                <li><Link to="/examples/quran-by-page" className="example-link">Quran by Page</Link> <span className="example-description">- Retrieve by page numbers</span></li>
                <li><Link to="/examples/quran-all-in-one-request" className="example-link">All-in-One Request</Link> <span className="example-description">- Comprehensive example</span></li>
              </ul>
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Link to="/examples" className="btn btn-lg btn-success" style={{ marginRight: '15px' }}>
              <i className="fas fa-code"></i> Browse Code Examples
            </Link>
            <Link to="/examples/quran-complete" className="btn btn-primary">
              <i className="fas fa-play"></i> Start with Basic Example
            </Link>
          </div>
        </div>

        <div className="docs-container">
          <elements-api
            apiDescriptionUrl={`${window.location.origin}/docs-assets/api.yaml`}
            router="hash"
            style={{ height: '80vh', border: '1px solid #ddd', borderRadius: '4px' }}
            hideInternal={true}
            hideTryIt={false}
            hideSchemas={false}
            hideExport={false}
          />
          
          <div id="api-fallback" style={{ display: 'none', padding: '20px', textAlign: 'center' }}>
            <div className="alert alert-warning">
              <h4>API Documentation Loading Issue</h4>
              <p>
                The interactive API documentation is having trouble loading. 
                You can still access the API directly or view our examples.
              </p>
              <div style={{ marginTop: '15px' }}>
                <a href="/docs-assets/api.yaml" target="_blank" className="btn btn-primary" style={{ marginRight: '10px' }}>
                  <i className="fas fa-download"></i> Download OpenAPI Spec
                </a>
                <Link to="/examples/quran-complete" className="btn btn-success">
                  <i className="fas fa-play"></i> View Examples
                </Link>
              </div>
            </div>
          </div>
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

        <Footer />
      </div>
    </div>
  );
};

export default DocsPage; 