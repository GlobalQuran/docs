import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const ExamplesHomePage = () => {
  const examples = [
    {
      id: 'quran-complete',
      title: 'Complete Quran Data',
      description: 'Fetch complete Quran text data with translations and metadata. This example shows how to retrieve all verses with their translations in a single request.',
      category: 'Basic',
      endpoint: '/v1/complete/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-book-open',
      version: 'v1'
    },
    {
      id: 'quran-by-surah',
      title: 'Quran by Surah',
      description: 'Retrieve specific chapters (surahs) of the Quran. Perfect for building chapter-based navigation or displaying individual surahs.',
      category: 'Basic',
      endpoint: '/v1/surah/{surahNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-list-ol',
      version: 'v1'
    },
    {
      id: 'quran-by-ayah',
      title: 'Quran by Ayah',
      description: 'Fetch individual verses (ayahs) from the Quran. Useful for verse-of-the-day features or specific verse lookups.',
      category: 'Basic',
      endpoint: '/v1/ayah/{ayahNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-quote-left',
      version: 'v1'
    },
    {
      id: 'quran-by-page',
      title: 'Quran by Page',
      description: 'Retrieve Quran content by page numbers as they appear in the Mushaf. Great for digital Quran readers.',
      category: 'Basic',
      endpoint: '/v1/page/{pageNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-file-alt',
      version: 'v1'
    },
    {
      id: 'quran-by-juz',
      title: 'Quran by Juz',
      description: 'Access Quran content organized by Juz (Para). Useful for apps that follow traditional Islamic study divisions.',
      category: 'Basic',
      endpoint: '/v1/juz/{juzNo}/{quranId}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-layer-group',
      version: 'v1'
    },
    {
      id: 'quran-v2-translations',
      title: 'v2 Translations List',
      description: 'Modern v2 API endpoint for retrieving translations with improved data structure. Translation IDs are crucial for API calls.',
      category: 'Basic',
      endpoint: '/v2/list/translation',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-language',
      version: 'v2'
    },
    {
      id: 'quran-v2-quran-list',
      title: 'v2 Quran List',
      description: 'Modern v2 API endpoint for retrieving Quran text formats with enhanced data structure. Quran IDs are essential for API calls.',
      category: 'Basic',
      endpoint: '/v2/list/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-list',
      version: 'v2'
    },
    {
      id: 'quran-all-in-one-request',
      title: 'All-in-One Request',
      description: 'Comprehensive example showing how to fetch multiple data types in a single request. Includes language detection, translations, and recitors.',
      category: 'Advanced',
      endpoint: '/v1/all/{dataIn}/{dataInNo}/{quranId}/{langCode}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-database',
      version: 'v1'
    },
    {
      id: 'quran-v2-recitors',
      title: 'v2 Recitors List',
      description: 'Modern v2 API endpoint for retrieving audio recitors with enhanced data structure and direct audio playback capabilities.',
      category: 'Advanced',
      endpoint: '/v2/list/recitor',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-microphone',
      version: 'v2'
    },
    {
      id: 'quran-v2-lists',
      title: 'v2 API Lists Demo',
      description: 'Demonstrates the new v2 API endpoints for listing translations, recitors, and Quran texts with improved data structures.',
      category: 'Advanced',
      endpoint: '/v2/list/{type}',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-rocket',
      version: 'v2'
    },
    {
      id: 'quran-list',
      title: 'Quran List (Legacy)',
      description: 'Get a complete list of all available Quran resources including text formats, translations, and audio recitations.',
      category: 'Legacy',
      endpoint: '/v1/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-list',
      version: 'v1'
    },
    {
      id: 'quran-list-translation',
      title: 'List Translations (Legacy)',
      description: 'Get a list of all available Quran translations in different languages. Essential for building language selection interfaces.',
      category: 'Legacy',
      endpoint: '/v1/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-language',
      version: 'v1'
    },
    {
      id: 'quran-list-recitors',
      title: 'List Recitors (Legacy)',
      description: 'Retrieve all available audio recitors with their formats and quality options. Perfect for building audio player interfaces.',
      category: 'Legacy',
      endpoint: '/v1/quran',
      languages: ['html', 'javascript', 'php', 'python'],
      icon: 'fas fa-microphone',
      version: 'v1'
    }
  ];

  const categories = {
    'Basic': examples.filter(ex => ex.category === 'Basic'),
    'Advanced': examples.filter(ex => ex.category === 'Advanced'),
    'Legacy': examples.filter(ex => ex.category === 'Legacy')
  };

  const getLanguageBadges = (languages) => {
    const languageIcons = {
      'html': 'fab fa-html5',
      'javascript': 'fab fa-js-square',
      'php': 'fab fa-php',
      'python': 'fab fa-python'
    };
    
    return languages.map(lang => (
      <span key={lang} className="badge badge-secondary" style={{ marginRight: '5px' }}>
        <i className={languageIcons[lang]}></i> {lang.toUpperCase()}
      </span>
    ));
  };

  return (
    <div className="container-fluid examples-gallery" style={{ padding: '0' }}>
      <div className="row" style={{ margin: '0' }}>
        <div className="col-md-12" style={{ padding: '0' }}>
          {/* Hero Section */}
          <div className="jumbotron" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)', color: 'white', marginBottom: '40px' }}>
            <div className="container">
              <h1 className="display-4">
                <i className="fas fa-code"></i> Code Examples Gallery
              </h1>
              <p className="lead">
                Explore comprehensive code examples for the GlobalQuran API in multiple programming languages. 
                Learn how to integrate Quranic content into your applications with real, working examples.
              </p>
              <div style={{ marginTop: '30px' }}>
                <Link to="/" className="btn btn-light btn-lg" style={{ marginRight: '15px' }}>
                  <i className="fas fa-book"></i> View API Documentation
                </Link>
                <a href="https://app.globalquran.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-key"></i> Get API Key
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="row" style={{ marginBottom: '40px' }}>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-primary">{examples.length}</h3>
                  <p className="card-text">Code Examples</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-success">4</h3>
                  <p className="card-text">Languages</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-info">2</h3>
                  <p className="card-text">API Versions</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3 className="text-warning">3</h3>
                  <p className="card-text">Categories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Examples by Category */}
          {Object.entries(categories).map(([categoryName, categoryExamples]) => (
            <div key={categoryName} style={{ marginBottom: '50px', padding: '0 30px' }}>
              <h2 style={{ 
                color: 'var(--primary-color)', 
                borderBottom: '3px solid var(--primary-color)', 
                paddingBottom: '10px',
                marginBottom: '30px'
              }}>
                <i className="fas fa-folder"></i> {categoryName} Examples
              </h2>
              
              <div className="row">
                {categoryExamples.map(example => (
                  <div key={example.id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="card-title">
                          <i className={example.icon} style={{ fontSize: '24px', color: 'var(--primary-color)', marginRight: '10px' }}></i>
                          {example.title}
                          {example.version && (
                            <span className={`version-badge ${example.version}`} style={{
                              display: 'inline-block',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              marginLeft: '8px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {example.version}
                            </span>
                          )}
                        </div>
                        
                        <p className="card-text">
                          {example.description}
                        </p>
                        
                        <div className="endpoint-info">
                          <small className="text-muted">
                            <strong>Endpoint:</strong> <code>{example.endpoint}</code>
                          </small>
                        </div>
                        
                        <div className="language-badges">
                          {getLanguageBadges(example.languages)}
                        </div>
                        
                        <Link 
                          to={`/examples/${example.id}`} 
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%' }}
                        >
                          <i className="fas fa-play"></i> View Example
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* API Key CTA */}
          <div className="alert alert-info" style={{ marginTop: '50px', textAlign: 'center', margin: '50px 30px 0' }}>
            <h4><i className="fas fa-key"></i> Ready to Get Started?</h4>
            <p className="mb-3">
              All examples use placeholder API keys. To see live data, you'll need your own API key.
            </p>
            <a href="https://app.globalquran.com" target="_blank" rel="noopener noreferrer" className="btn btn-success btn-lg">
              <i className="fas fa-envelope"></i> Request API Key
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ExamplesHomePage;
