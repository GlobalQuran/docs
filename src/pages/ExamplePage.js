import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import '../styles/prism-custom.css';
import '../styles/examples.css';
import Footer from '../components/Footer';

const ExamplePage = () => {
  const { exampleName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sourceCode, setSourceCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const codeRef = useRef(null);
  
  // Real API key for preview functionality
  const REAL_API_KEY = '7YuepfqaL3bdYYxAglTc7JwxZmwJd6g1jLvYXOLDo2vyW';
  const API_KEY_PLACEHOLDER = 'YOUR_API_KEY';

  const examples = [
    {
      id: 'quran-complete',
      title: 'Complete Quran Data',
      description: 'Fetch complete Quran text data with translations and metadata. This example shows how to retrieve all verses with their translations in a single request.',
      category: 'Basic',
      endpoint: '/v1/complete/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/complete/quran-simple?key=YOUR_API_KEY',
      icon: 'fas fa-book-open'
    },
    {
      id: 'quran-by-surah',
      title: 'Quran by Surah',
      description: 'Retrieve specific chapters (surahs) of the Quran. Perfect for building chapter-based navigation or displaying individual surahs.',
      category: 'Basic',
      endpoint: '/v1/surah/{surahNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/surah/1/quran-simple?key=YOUR_API_KEY',
      icon: 'fas fa-list-ol'
    },
    {
      id: 'quran-by-ayah',
      title: 'Quran by Ayah',
      description: 'Fetch individual verses (ayahs) from the Quran. Useful for verse-of-the-day features or specific verse lookups.',
      category: 'Basic',
      endpoint: '/v1/ayah/{ayahNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/ayah/2:255/quran-simple?key=YOUR_API_KEY',
      icon: 'fas fa-quote-left'
    },
    {
      id: 'quran-by-page',
      title: 'Quran by Page',
      description: 'Retrieve Quran content by page numbers as they appear in the Mushaf. Great for digital Quran readers.',
      category: 'Basic',
      endpoint: '/v1/page/{pageNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/page/1/quran-simple?key=YOUR_API_KEY',
      icon: 'fas fa-file-alt'
    },
    {
      id: 'quran-by-juz',
      title: 'Quran by Juz',
      description: 'Access Quran content organized by Juz (Para). Useful for apps that follow traditional Islamic study divisions.',
      category: 'Advanced',
      endpoint: '/v1/juz/{juzNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/juz/1/quran-simple?key=YOUR_API_KEY',
      icon: 'fas fa-layer-group'
    },
    {
      id: 'quran-list',
      title: 'Quran List',
      description: 'Get a complete list of all available Quran resources including text formats, translations, and audio recitations.',
      category: 'Basic',
      endpoint: '/v1/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/quran?key=YOUR_API_KEY',
      icon: 'fas fa-list'
    },
    {
      id: 'quran-list-translation',
      title: 'List Translations',
      description: 'Get a list of all available Quran translations in different languages. Essential for building language selection interfaces.',
      category: 'Basic',
      endpoint: '/v1/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/quran?key=YOUR_API_KEY',
      icon: 'fas fa-language'
    },
    {
      id: 'quran-list-recitors',
      title: 'List Recitors',
      description: 'Retrieve all available audio recitors with their formats and quality options. Perfect for building audio player interfaces.',
      category: 'Advanced',
      endpoint: '/v1/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/quran?key=YOUR_API_KEY',
      icon: 'fas fa-microphone'
    },
    {
      id: 'quran-all-in-one-request',
      title: 'All-in-One Request',
      description: 'Comprehensive example showing how to fetch multiple data types in a single request. Includes language detection, translations, and recitors.',
      category: 'Advanced',
      endpoint: '/v1/all/{dataIn}/{dataInNo}/{quranId}/{langCode}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v1/all/surah/1/quran-simple/en?key=YOUR_API_KEY',
      icon: 'fas fa-database'
    },
    {
      id: 'quran-v2-lists',
      title: 'v2 API Lists Demo',
      description: 'Demonstrates the new v2 API endpoints for listing translations, recitors, and Quran texts with improved data structures.',
      category: 'v2 API',
      endpoint: '/v2/list/{type}',
      languages: ['html', 'javascript', 'php', 'python'],
      sampleEndpoint: 'https://api.globalquran.com/v2/list/translation?key=YOUR_API_KEY',
      icon: 'fas fa-rocket',
      version: 'v2'
    }
  ];

  const currentExample = examples.find(ex => ex.id === exampleName) || examples[0];
  const currentIndex = examples.findIndex(ex => ex.id === exampleName);

  // URL-based tab tracking
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl && ['preview', 'html', 'javascript', 'php', 'python'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('tab', newTab);
    navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
  };

  // Function to replace API key placeholder with real key for preview
  const replaceApiKeyForPreview = (code) => {
    if (!code) return code;
    return code.replace(new RegExp(API_KEY_PLACEHOLDER, 'g'), REAL_API_KEY);
  };

  // Function to ensure source code display uses placeholder
  const ensureApiKeyPlaceholder = (code) => {
    if (!code) return code;
    return code.replace(new RegExp(REAL_API_KEY, 'g'), API_KEY_PLACEHOLDER);
  };

  // Function to detect the primary language of the code
  const detectLanguage = (code) => {
    if (!code) return 'markup';
    
    // Use activeTab to determine language
    if (activeTab === 'html') return 'markup';
    if (activeTab === 'javascript') return 'javascript';
    if (activeTab === 'php') return 'php';
    if (activeTab === 'python') return 'python';
    
    // Fallback detection
    if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<head') || code.includes('<body')) {
      return 'markup';
    }
    
    if (code.includes('$(') || code.includes('jQuery(') || code.includes('function(') || code.includes('var ') || code.includes('let ') || code.includes('const ')) {
      return 'javascript';
    }
    
    if (code.includes('<?php') || code.includes('curl_init') || code.includes('json_decode')) {
      return 'php';
    }
    
    if (code.includes('import ') || code.includes('def ') || code.includes('requests.get')) {
      return 'python';
    }
    
    return 'markup';
  };

  // Function to check if code contains jQuery
  const hasJQuery = (code) => {
    if (!code) return false;
    return code.includes('$(') || code.includes('jQuery(') || code.includes('.ready(') || 
           code.includes('.click(') || code.includes('.ajax(') || code.includes('.get(') ||
           code.includes('.post(') || code.includes('.load(');
  };

  // Load source code based on active tab
  useEffect(() => {
    const fetchSourceCode = async () => {
      try {
        setLoading(true);
        let filePath;
        
        if (activeTab === 'html') {
          filePath = `/docs-assets/examples/${currentExample.id}.html`;
        } else if (activeTab !== 'preview') {
          // Map tab names to file extensions
          const fileExtensions = {
            'html': 'html',
            'javascript': 'js',
            'php': 'php',
            'python': 'py'
          };
          const extension = fileExtensions[activeTab] || activeTab;
          filePath = `/docs-assets/examples/languages/${currentExample.id}.${extension}`;
        } else {
          // For preview tab, load HTML for iframe
          filePath = `/docs-assets/examples/${currentExample.id}.html`;
        }
        
        const response = await fetch(filePath);
        if (response.ok) {
          const code = await response.text();
          const codeWithPlaceholder = ensureApiKeyPlaceholder(code);
          setSourceCode(codeWithPlaceholder);
        } else {
          setSourceCode(`// ${activeTab.toUpperCase()} code not available for this example`);
        }
      } catch (error) {
        console.error('Error fetching source code:', error);
        setSourceCode(`// Error loading ${activeTab.toUpperCase()} code`);
      } finally {
        setLoading(false);
      }
    };

    fetchSourceCode();
  }, [currentExample.id, activeTab]);

  // Effect to apply syntax highlighting
  useEffect(() => {
    if (!loading && sourceCode && codeRef.current) {
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    }
  }, [loading, sourceCode, activeTab]);

  // Effect to resize iframe based on content
  useEffect(() => {
    if (activeTab === 'preview') {
      const iframe = document.querySelector('.preview-iframe');
      if (iframe) {
        const resizeIframe = () => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc) {
              const height = Math.max(
                iframeDoc.body.scrollHeight,
                iframeDoc.body.offsetHeight,
                iframeDoc.documentElement.clientHeight,
                iframeDoc.documentElement.scrollHeight,
                iframeDoc.documentElement.offsetHeight
              );
              iframe.style.height = Math.max(height + 20, 600) + 'px';
            }
          } catch (e) {
            // Cross-origin error, fallback to fixed height
            iframe.style.height = '1200px';
          }
        };

        // Resize after iframe loads
        iframe.onload = () => {
          setTimeout(resizeIframe, 500);
        };

        // Also resize after a delay to catch dynamic content
        setTimeout(resizeIframe, 1000);
      }
    }
  }, [activeTab, sourceCode]);

  // Function to copy code to clipboard
  const copyToClipboard = async () => {
    try {
      const codeToCopy = ensureApiKeyPlaceholder(sourceCode);
      await navigator.clipboard.writeText(codeToCopy);
      alert('Code copied to clipboard! (API key replaced with placeholder)');
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Function to open example in new tab with real API key
  const openInNewTab = () => {
    const htmlWithRealKey = replaceApiKeyForPreview(sourceCode);
    const blob = new Blob([htmlWithRealKey], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const navigateToExample = (exampleId) => {
    // Preserve current tab when navigating to different example
    const urlParams = new URLSearchParams(location.search);
    const currentTab = urlParams.get('tab') || 'preview';
    
    navigate(`/examples/${exampleId}?tab=${currentTab}`);
    setSidebarOpen(false);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : examples.length - 1;
    navigateToExample(examples[prevIndex].id);
  };

  const goToNext = () => {
    const nextIndex = currentIndex < examples.length - 1 ? currentIndex + 1 : 0;
    navigateToExample(examples[nextIndex].id);
  };

  // Group examples by category
  const categories = {
    'Basic': examples.filter(ex => ex.category === 'Basic'),
    'Advanced': examples.filter(ex => ex.category === 'Advanced'),
    'v2 API': examples.filter(ex => ex.category === 'v2 API')
  };

  const languageTabs = currentExample.languages.map(lang => ({
    value: lang,
    label: lang.charAt(0).toUpperCase() + lang.slice(1),
    icon: {
      'html': 'fab fa-html5',
      'javascript': 'fab fa-js-square',
      'php': 'fab fa-php',
      'python': 'fab fa-python'
    }[lang]
  }));

  return (
    <>
      <div className="examples-page-wrapper">
        <div className="examples-container">
          {/* Sidebar Navigation */}
          <div className={`examples-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>
                <i className="fas fa-code"></i> Examples
              </h3>
            </div>
            
            {Object.entries(categories).map(([categoryName, categoryExamples]) => (
              <div key={categoryName} className="category-section">
                <h4 className="category-title">{categoryName}</h4>
                {categoryExamples.map(example => (
                  <a
                    key={example.id}
                    href="#"
                    className={`example-item ${example.id === currentExample.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToExample(example.id);
                    }}
                  >
                    <span className="example-title">
                      <i className={example.icon}></i> {example.title}
                      {example.version && (
                        <span className={`version-badge ${example.version}`}>
                          {example.version}
                        </span>
                      )}
                    </span>
                    <span className="example-endpoint">{example.endpoint}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="examples-main-content">
            {/* Header */}
            <div className="examples-header">
              <button 
                className="mobile-sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
              
              <h1>
                <i className={currentExample.icon}></i> {currentExample.title}
              </h1>
              <p className="example-description">{currentExample.description}</p>
              
              {/* Navigation Controls */}
              <div style={{ marginTop: '15px' }}>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={goToPrevious}
                  disabled={loading}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={goToNext}
                  disabled={loading}
                  style={{ marginLeft: '10px' }}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
                <Link 
                  to="/examples" 
                  className="btn btn-sm btn-outline-secondary"
                  style={{ marginLeft: '15px' }}
                >
                  <i className="fas fa-th"></i> All Examples
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="examples-content">
              {/* Endpoint Display */}
              {currentExample.sampleEndpoint !== 'N/A' && (
                <div className="endpoint-display">
                  <div className="endpoint-label">API Endpoint</div>
                  <div className="endpoint-url">{currentExample.sampleEndpoint}</div>
                </div>
              )}

              {/* Tab Interface */}
              <div className="examples-tabs">
                <ul className="nav nav-tabs examples-tab-nav">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
                      onClick={() => handleTabChange('preview')}
                    >
                      <i className="fas fa-play"></i> Preview
                    </button>
                  </li>
                  {languageTabs.map(langTab => (
                    <li key={langTab.value} className="nav-item">
                      <button
                        className={`nav-link ${activeTab === langTab.value ? 'active' : ''}`}
                        onClick={() => handleTabChange(langTab.value)}
                      >
                        <i className={langTab.icon}></i> {langTab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="tab-content examples-tab-content">
                  {/* Preview Tab */}
                  {activeTab === 'preview' && (
                    <div className="preview-display">
                      <div className="preview-header">
                        <h5 className="preview-title">Live Demo</h5>
                        <button 
                          className="open-new-tab-btn"
                          onClick={openInNewTab}
                        >
                          <i className="fas fa-external-link-alt"></i> Open in New Tab
                        </button>
                      </div>
                      <iframe
                        srcDoc={replaceApiKeyForPreview(sourceCode)}
                        className="preview-iframe"
                        title={`${currentExample.title} Demo`}
                      />
                    </div>
                  )}

                  {/* Language Code Tabs */}
                  {activeTab !== 'preview' && (
                    <div>
                      {/* Code Display */}
                      <div className="code-display">
                        <div className="code-header">
                          <span className="language-badge">
                            <i className={languageTabs.find(tab => tab.value === activeTab)?.icon}></i>
                            {activeTab.toUpperCase()}
                          </span>
                          <button 
                            className="copy-btn"
                            onClick={copyToClipboard}
                            disabled={loading}
                          >
                            <i className="fas fa-copy"></i> Copy Code
                          </button>
                        </div>
                        
                        {loading ? (
                          <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i> Loading {activeTab} code...
                          </div>
                        ) : (
                          <pre>
                            <code 
                              ref={codeRef}
                              className={`language-${detectLanguage(sourceCode)}`}
                            >
                              {sourceCode}
                            </code>
                          </pre>
                        )}
                      </div>

                      {/* Response Structure */}
                      {currentExample.sampleEndpoint !== 'N/A' && (
                        <div className="response-structure">
                          <div className="structure-label">Expected Response Structure</div>
                          <pre>
{`{
  "quran": {
    "1": {
      "1": { "surah": 1, "ayah": 1, "verse": "..." },
      "2": { "surah": 1, "ayah": 2, "verse": "..." }
    }
  }
}`}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ExamplePage;