import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuranData } from '../store/slices/quranSlice';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Footer from '../components/Footer';

const DataPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { textFormats: quranData, loading, error, lastFetched } = useSelector(state => state.quran);

  // Fetch data on component mount or if data is stale (older than 5 minutes)
  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const isDataStale = !lastFetched || (Date.now() - lastFetched) > CACHE_DURATION;
    
    if (quranData.length === 0 || isDataStale) {
      dispatch(fetchQuranData());
    }
  }, [dispatch, quranData.length, lastFetched]);

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

  const downloadSelectedFiles = async (format) => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to download.');
      return;
    }

    const zip = new JSZip();
    const selectedData = quranData.filter(item => selectedItems.includes(item.id));
    
    try {
      // Create a folder for the selected format
      const folder = zip.folder(`quran-data-${format}`);
      
      for (const item of selectedData) {
        let url, filename, content;
        
        switch (format) {
          case 'text':
            url = getApiUrl(item.id, 'txt');
            filename = `${item.id}.txt`;
            break;
          case 'json':
            url = getApiUrl(item.id, 'json');
            filename = `${item.id}.json`;
            break;
          case 'jsonp':
            url = getApiUrl(item.id, 'jsonp');
            filename = `${item.id}.jsonp`;
            break;
          default:
            continue;
        }
        
        try {
          // Fetch the content from the API
          const response = await fetch(url);
          if (response.ok) {
            content = await response.text();
            folder.file(filename, content);
          } else {
            console.warn(`Failed to fetch ${filename}: ${response.status}`);
            // Add a placeholder file indicating the error
            folder.file(filename, `Error: Could not fetch data from ${url}\nStatus: ${response.status}`);
          }
        } catch (error) {
          console.warn(`Error fetching ${filename}:`, error);
          // Add a placeholder file indicating the error
          folder.file(filename, `Error: Could not fetch data from ${url}\nError: ${error.message}`);
        }
      }
      
      // Add a README file with information about the download
      const readme = `Quran Data Download - ${format.toUpperCase()} Format
Generated on: ${new Date().toISOString()}
Total files: ${selectedData.length}

Files included:
${selectedData.map(item => `- ${item.id} (${item.name})`).join('\n')}

For more information, visit: https://globalquran.com/
API Documentation: https://docs.globalquran.com/
`;
      
      folder.file('README.txt', readme);
      
      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `quran-data-${format}-${new Date().toISOString().split('T')[0]}.zip`);
      
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Error creating download file. Please try again.');
    }
  };

  return (
    <div className="row" id="top">
      <div className="col-md-12">
        {loading && (
          <div className="alert alert-info text-center">
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h4>Loading Quran Data...</h4>
            <p>Please wait while we fetch the latest Quran translations and resources from the API.</p>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger">
            <h4>Error Loading Data</h4>
            <p>{error}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && quranData.length === 0 && (
          <div className="alert alert-warning">
            <h4>No Data Available</h4>
            <p>No Quran translations found. Please check back later.</p>
          </div>
        )}
        {!loading && !error && quranData.length > 0 && (
          <>
            <div className="pull-right">
          <div className="btn-group">
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              onClick={() => downloadSelectedFiles('text')}
              disabled={selectedItems.length === 0}
              title="Download selected items as text files"
            >
              <i className="fas fa-download"></i> Text
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              onClick={() => downloadSelectedFiles('json')}
              disabled={selectedItems.length === 0}
              title="Download selected items as JSON files"
              style={{ marginLeft: '5px' }}
            >
              <i className="fas fa-download"></i> JSON
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm" 
              onClick={() => downloadSelectedFiles('jsonp')}
              disabled={selectedItems.length === 0}
              title="Download selected items as JSONP files"
              style={{ marginLeft: '5px' }}
            >
              <i className="fas fa-download"></i> JSONP
            </button>
          </div>
          {selectedItems.length > 0 && (
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
          )}
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
                <i className="fas fa-exclamation-circle"></i>
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

        <Footer />
        </>
        )}
      </div>
    </div>
  );
};

export default DataPage; 