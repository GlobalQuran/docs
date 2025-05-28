import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme that looks great
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css'; // CSS
import 'prismjs/components/prism-javascript'; // JavaScript/jQuery
import 'prismjs/components/prism-markup-templating'; // For mixed content
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import '../styles/prism-custom.css';
import Footer from '../components/Footer';

const ExamplePage = () => {
  const { exampleName } = useParams();
  const navigate = useNavigate();
  const [sourceCode, setSourceCode] = useState('');
  const [loading, setLoading] = useState(true);
  const codeRef = useRef(null);

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
    },
    {
      id: 'test-jquery',
      title: 'jQuery Highlighting Test',
      description: 'Test example showcasing jQuery syntax highlighting with various jQuery methods and patterns.',
      category: 'Advanced'
    }
  ];

  const currentExample = examples.find(ex => ex.id === exampleName) || examples[0];
  const currentIndex = examples.findIndex(ex => ex.id === exampleName);

  // Function to detect the primary language of the code
  const detectLanguage = (code) => {
    if (!code) return 'markup';
    
    // Check if it's primarily HTML
    if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<head') || code.includes('<body')) {
      return 'markup';
    }
    
    // Check if it's primarily JavaScript/jQuery
    if (code.includes('$(') || code.includes('jQuery(') || code.includes('function(') || code.includes('var ') || code.includes('let ') || code.includes('const ')) {
      return 'javascript';
    }
    
    // Default to markup for mixed content
    return 'markup';
  };

  // Function to check if code contains jQuery
  const hasJQuery = (code) => {
    if (!code) return false;
    return code.includes('$(') || code.includes('jQuery(') || code.includes('.ready(') || 
           code.includes('.click(') || code.includes('.ajax(') || code.includes('.get(') ||
           code.includes('.post(') || code.includes('.load(');
  };

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

  // Effect to apply syntax highlighting
  useEffect(() => {
    if (!loading && sourceCode && codeRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    }
  }, [loading, sourceCode]);

  // Function to copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      // You could add a toast notification here
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

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
                  <small style={{ marginLeft: '10px', color: '#666' }}>
                    ({detectLanguage(sourceCode).toUpperCase()})
                  </small>
                  <div className="btn-group pull-right" style={{ marginTop: '-2px' }}>
                    <button 
                      className="btn btn-xs btn-default"
                      onClick={copyToClipboard}
                      title="Copy to Clipboard"
                      disabled={loading}
                    >
                      <i className="fas fa-copy"></i> Copy
                    </button>
                    {hasJQuery(sourceCode) && (
                      <span className="btn btn-xs btn-success" style={{ cursor: 'default' }}>
                        <i className="fab fa-js-square"></i> jQuery
                      </span>
                    )}
                  </div>
                </h3>
              </div>
              <div className="panel-body" style={{ padding: '0' }}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <i className="fas fa-spinner fa-spin"></i> Loading source code...
                  </div>
                ) : (
                  <pre 
                    className="line-numbers"
                    style={{ 
                      margin: '0', 
                      fontSize: '12px',
                      maxHeight: '600px',
                      overflowY: 'auto',
                      border: 'none',
                      backgroundColor: '#2d3748'
                    }}
                  >
                    <code 
                      ref={codeRef}
                      className={`language-${detectLanguage(sourceCode)}`}
                      style={{ 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {sourceCode}
                    </code>
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

        <Footer />
      </div>
    </div>
  );
};

export default ExamplePage; 