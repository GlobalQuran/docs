import React, { useState } from 'react';

const DataPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample data based on the original HTML
  const quranData = [
    {
      id: 'ar.muyassar',
      language: 'ar',
      name: 'King Fahad Quran Complex',
      localName: 'تفسير المیسر',
      type: 'tafsir'
    },
    {
      id: 'az.mammadaliyev',
      language: 'az',
      name: 'Vasim Mammadaliyev and Ziya Bunyadov',
      localName: 'Məmmədəliyev & Bünyadov',
      type: 'translation'
    },
    {
      id: 'az.musayev',
      language: 'az',
      name: 'Alikhan Musayev',
      localName: 'Musayev',
      type: 'translation'
    },
    {
      id: 'bn.bengali',
      language: 'bn',
      name: 'Muhiuddin Khan',
      localName: 'মুহিউদ্দীন খান',
      type: 'translation'
    },
    {
      id: 'cs.hrbek',
      language: 'cs',
      name: 'Preklad I. Hrbek',
      localName: 'Hrbek',
      type: 'translation'
    },
    {
      id: 'cs.nykl',
      language: 'cs',
      name: 'A. R. Nykl',
      localName: 'Nykl',
      type: 'translation'
    },
    {
      id: 'en.sahih',
      language: 'en',
      name: 'Sahih International',
      localName: 'Sahih International',
      type: 'translation'
    },
    {
      id: 'en.pickthall',
      language: 'en',
      name: 'Mohammed Marmaduke William Pickthall',
      localName: 'Pickthall',
      type: 'translation'
    },
    {
      id: 'en.yusufali',
      language: 'en',
      name: 'Abdullah Yusuf Ali',
      localName: 'Yusuf Ali',
      type: 'translation'
    },
    {
      id: 'fr.hamidullah',
      language: 'fr',
      name: 'Muhammad Hamidullah',
      localName: 'Hamidullah',
      type: 'translation'
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(quranData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getApiUrl = (id, format = 'txt') => {
    const baseUrl = 'https://api.globalquran.com/complete/';
    switch (format) {
      case 'json':
        return `${baseUrl}${id}.json`;
      case 'jsonp':
        return `${baseUrl}${id}.jsonp`;
      default:
        return `${baseUrl}${id}`;
    }
  };

  const getViewUrl = (id) => {
    return `https://globalquran.com/${id}/1.1`;
  };

  return (
    <div className="row" id="top">
      <div className="col-md-12">
        <div className="pull-right">
          <div className="btn-group">
            <button 
              type="button" 
              className="btn btn-primary btn-lg dropdown-toggle" 
              data-toggle="dropdown"
              disabled={selectedItems.length === 0}
            >
              <i className="icon-cloud-download"></i> Download 
              {selectedItems.length > 0 && ` (${selectedItems.length})`}
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" role="menu">
              <li><a href="#" className="download" data-by="text">text</a></li>
              <li><a href="#" className="download" data-by="json">json</a></li>
              <li><a href="#" className="download" data-by="js">js (desktop app)</a></li>
            </ul>
          </div>
        </div>

        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  id="selectAll"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === quranData.length}
                />
              </th>
              <th>Lang</th>
              <th>Name</th>
              <th>Local Name</th>
              <td className="text-right">
                <a href="https://docs.globalquran.com/#/operations/get-quran-surah">by surah</a>,{' '}
                <a href="https://docs.globalquran.com/#/operations/get-quran-juz">by juz</a>,{' '}
                <a href="https://docs.globalquran.com/#/operations/get-quran-page">by page</a>,{' '}
                <a href="https://docs.globalquran.com/#/operations/get-quran-ayah">by ayah</a>
                <i className="icon-exclamation-sign"></i>
              </td>
            </tr>
          </thead>
          <tbody>
            {quranData.map((item) => (
              <tr key={item.id}>
                <td>
                  <input 
                    type="checkbox" 
                    name="by" 
                    value={item.id}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                  />
                </td>
                <td>{item.language}</td>
                <td>{item.name}</td>
                <td>{item.localName}</td>
                <td>
                  <div className="pull-right text-right">
                    <a 
                      href={getViewUrl(item.id)} 
                      className="text-muted" 
                      title="read & listen"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      view
                    </a> |{' '}
                    <a 
                      href={getApiUrl(item.id, 'txt')} 
                      className="text-muted" 
                      title="api direct link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      txt
                    </a> |{' '}
                    <a 
                      href={getApiUrl(item.id, 'json')} 
                      className="text-muted" 
                      title="api direct link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      json
                    </a> |{' '}
                    <a 
                      href={getApiUrl(item.id, 'jsonp')} 
                      className="text-muted" 
                      title="api direct link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      jsonp
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="alert alert-info" style={{ marginTop: '20px' }}>
          <h4>About the Data</h4>
          <p>
            This page provides access to various Quran translations and commentaries in different languages. 
            Each resource is available in multiple formats (text, JSON, JSONP) for easy integration into your applications.
          </p>
          <p>
            <strong>API Usage:</strong> Visit our <a href="https://docs.globalquran.com/" target="_blank" rel="noopener noreferrer">API documentation</a> for detailed information on how to use these resources programmatically.
          </p>
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

export default DataPage; 