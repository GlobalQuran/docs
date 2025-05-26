import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamplePage = () => {
  const { exampleName } = useParams();
  const navigate = useNavigate();
  const [sourceCode, setSourceCode] = useState('');
  const [loading, setLoading] = useState(true);

  const examples = [
    {
      id: 'quran-complete',
      title: 'Complete Quran Data',
      description: 'Fetch complete Quran text data with translations and metadata. This example shows how to retrieve all verses with their translations in a single request.',
      category: 'Basic'
    },
    {
      id: 'quran-by-surah',
      title: 'Quran by Surah',
      description: 'Retrieve specific chapters (surahs) of the Quran. Perfect for building chapter-based navigation or displaying individual surahs.',
      category: 'Basic'
    },
    {
      id: 'quran-by-ayah',
      title: 'Quran by Ayah',
      description: 'Fetch individual verses (ayahs) from the Quran. Useful for verse-of-the-day features or specific verse lookups.',
      category: 'Basic'
    },
    {
      id: 'quran-list-translation',
      title: 'List Translations',
      description: 'Get a list of all available Quran translations in different languages. Essential for building language selection interfaces.',
      category: 'Basic'
    },
    {
      id: 'quran-list-recitors',
      title: 'List Recitors',
      description: 'Retrieve all available audio recitors with their formats and quality options. Perfect for building audio player interfaces.',
      category: 'Advanced'
    },
    {
      id: 'quran-by-juz',
      title: 'Quran by Juz',
      description: 'Access Quran content organized by Juz (Para). Useful for apps that follow traditional Islamic study divisions.',
      category: 'Advanced'
    },
    {
      id: 'quran-by-page',
      title: 'Quran by Page',
      description: 'Retrieve Quran content by page numbers as they appear in the Mushaf. Great for digital Quran readers.',
      category: 'Advanced'
    },
    {
      id: 'quran-all-in-one-request',
      title: 'All-in-One Request',
      description: 'Comprehensive example showing how to fetch multiple data types in a single request. Includes language detection, translations, and recitors.',
      category: 'Advanced'
    },
    {
      id: 'quran-list',
      title: 'Quran List',
      description: 'Get a complete list of all available Quran resources including text formats, translations, and audio recitations.',
      category: 'Basic'
    }
  ];

  const currentExample = examples.find(ex => ex.id === exampleName) || examples[0];
  const currentIndex = examples.findIndex(ex => ex.id === exampleName);

  useEffect(() => {
    const fetchSourceCode = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/docs-assets/examples/${currentExample.id}.html`);
        if (response.ok) {
          const code = await response.text();
          setSourceCode(code);
        } else {
          setSourceCode('// Source code not available');
        }
      } catch (error) {
        console.error('Error fetching source code:', error);
        setSourceCode('// Error loading source code');
      } finally {
        setLoading(false);
      }
    };

    fetchSourceCode();
  }, [currentExample.id]);

  const navigateToExample = (exampleId) => {
    navigate(`/examples/${exampleId}`);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : examples.length - 1;
    navigateToExample(examples[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = currentIndex < examples.length - 1 ? currentIndex + 1 : 0;
    navigateToExample(examples[nextIndex].id);
  };

  const basicExamples = examples.filter(ex => ex.category === 'Basic');
  const advancedExamples = examples.filter(ex => ex.category === 'Advanced');

  return (
    <div className="row" id="top">
      <div className="col-md-12">
        <div style={{ marginBottom: '20px' }}>
          <button 
            className="btn btn-default btn-sm"
            onClick={() => navigate('/docs')}
          >
            <i className="fas fa-arrow-left"></i> Back to Documentation
          </button>
        </div>

        <h1>{currentExample.title}</h1>
        <p className="lead">{currentExample.description}</p>

        {/* Navigation Controls */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-6">
            <div className="btn-group" style={{ width: '100%' }}>
              <button 
                className="btn btn-primary btn-sm"
                onClick={goToPrevious}
                title="Previous Example"
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={goToNext}
                title="Next Example"
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <select 
              className="form-control input-sm"
              value={currentExample.id}
              onChange={(e) => navigateToExample(e.target.value)}
            >
              <optgroup label="Basic Examples">
                {basicExamples.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title}</option>
                ))}
              </optgroup>
              <optgroup label="Advanced Examples">
                {advancedExamples.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Source Code Panel */}
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">
                  <i className="fas fa-code"></i> Source Code
                </h3>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin"></i> Loading source code...
                  </div>
                ) : (
                  <pre style={{ 
                    margin: '0', 
                    padding: '15px', 
                    backgroundColor: '#f8f9fa',
                    fontSize: '12px',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    border: 'none'
                  }}>
                    <code>{sourceCode}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Demo Preview Panel */}
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">
                  <i className="fas fa-play"></i> Live Demo
                  <a 
                    href={`/docs-assets/examples/${currentExample.id}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xs btn-primary pull-right"
                    style={{ marginTop: '-2px' }}
                  >
                    <i className="fas fa-external-link-alt"></i> Open in New Tab
                  </a>
                </h3>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                <iframe
                  src={`/docs-assets/examples/${currentExample.id}.html`}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                    backgroundColor: '#fff'
                  }}
                  title={`${currentExample.title} Demo`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Example Navigation Grid */}
        <div className="row" style={{ marginTop: '30px' }}>
          <div className="col-md-12">
            <h3>All Examples</h3>
            <div className="row">
              <div className="col-md-6">
                <h4>Basic Examples</h4>
                <div className="list-group">
                  {basicExamples.map(ex => (
                    <button
                      key={ex.id}
                      className={`list-group-item ${ex.id === currentExample.id ? 'active' : ''}`}
                      onClick={() => navigateToExample(ex.id)}
                    >
                      <h5 className="list-group-item-heading">{ex.title}</h5>
                      <p className="list-group-item-text" style={{ fontSize: '12px' }}>
                        {ex.description.substring(0, 100)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h4>Advanced Examples</h4>
                <div className="list-group">
                  {advancedExamples.map(ex => (
                    <button
                      key={ex.id}
                      className={`list-group-item ${ex.id === currentExample.id ? 'active' : ''}`}
                      onClick={() => navigateToExample(ex.id)}
                    >
                      <h5 className="list-group-item-heading">{ex.title}</h5>
                      <p className="list-group-item-text" style={{ fontSize: '12px' }}>
                        {ex.description.substring(0, 100)}...
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

export default ExamplePage; 