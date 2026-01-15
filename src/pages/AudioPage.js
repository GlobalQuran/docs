import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuranData } from '../store/slices/quranSlice';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Footer from '../components/Footer';

const AudioPage = () => {
  const [selectedRecitor, setSelectedRecitor] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [playingRecitor, setPlayingRecitor] = useState(null);
  const audioRefs = useRef({});
  const dispatch = useDispatch();

  // Get data from Redux store
  const { audioFormats: recitorData, loading, error, lastFetched } = useSelector(state => state.quran);

  // Total verses in Quran
  const TOTAL_VERSES = 6236;

  // Fetch data on component mount or if data is stale (older than 5 minutes)
  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const isDataStale = !lastFetched || (Date.now() - lastFetched) > CACHE_DURATION;
    
    if (recitorData.length === 0 || isDataStale) {
      dispatch(fetchQuranData());
    }
  }, [dispatch, recitorData.length, lastFetched]);

  const formatAudioUrl = (recitorId, format, kbs, verseNumber) => {
    // Determine file extension based on format type
    const extension = format === 'ogg' ? 'ogg' : 'mp3';
    // Build audio URL: https://audio.globalquran.com/{recitorId}/{format}/{bitrate}kbs/{verseNumber}.{extension}
    const audioUrl = `https://audio.globalquran.com/${recitorId}/${format}/${kbs}kbs/${verseNumber}.${extension}`;
    return audioUrl;
  };

  const getHighestQualityFormat = (media) => {
    // Find the format with highest kbs (bandwidth)
    let highestFormat = null;
    let highestKbs = 0;
    
    Object.entries(media).forEach(([format, info]) => {
      const kbs = parseInt(info.kbs) || 0;
      if (kbs > highestKbs) {
        highestKbs = kbs;
        highestFormat = format;
      }
    });
    
    return highestFormat;
  };

  const getDemoAudioUrl = useCallback((recitor) => {
    const highestFormat = getHighestQualityFormat(recitor.media);
    if (!highestFormat || !recitor.media[highestFormat]) return null;
    
    const formatInfo = recitor.media[highestFormat];
    const formatType = formatInfo.type || 'mp3';
    const kbs = formatInfo.kbs || '128';
    
    return formatAudioUrl(recitor.id, formatType, kbs, 1); // Use verse 1 for demo
  }, []);

  const toggleAudio = useCallback((recitorId) => {
    const audioElement = audioRefs.current[recitorId];
    if (!audioElement) return;
    
    if (playingRecitor === recitorId) {
      audioElement.pause();
      setPlayingRecitor(null);
    } else {
      // Pause any currently playing audio
      Object.values(audioRefs.current).forEach(audio => audio.pause());
      
      audioElement.play().then(() => {
        setPlayingRecitor(recitorId);
      }).catch(error => {
        console.error('Error playing audio:', error);
        alert('Error playing audio. Please try again.');
      });
    }
  }, [playingRecitor]);

  const handleAudioEnded = useCallback((recitorId) => {
    if (playingRecitor === recitorId) {
      setPlayingRecitor(null);
    }
  }, [playingRecitor]);

  const downloadAllVerses = async (recitor, format) => {
    if (!recitor.media[format]) {
      alert('Selected format is not available for this recitor.');
      return;
    }

    const zip = new JSZip();
    const formatInfo = recitor.media[format];
    const formatType = formatInfo.type || 'mp3';
    const kbs = formatInfo.kbs || '128';
    
    try {
      setDownloadProgress({ current: 0, total: TOTAL_VERSES, recitor: recitor.name, format });
      
      // Create a folder for the recitor
      const folder = zip.folder(`${recitor.id}-${format.replace('-', '_')}`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (let verse = 1; verse <= TOTAL_VERSES; verse++) {
        try {
          const audioUrl = formatAudioUrl(recitor.id, formatType, kbs, verse);
          const response = await fetch(audioUrl);
          
          if (response.ok) {
            const audioBlob = await response.blob();
            // Use leading zeros for ZIP file organization (better sorting)
            folder.file(`${verse.toString().padStart(3, '0')}.mp3`, audioBlob);
            successCount++;
          } else {
            console.warn(`Failed to fetch verse ${verse}: ${response.status}`);
            failCount++;
          }
        } catch (error) {
          console.warn(`Error fetching verse ${verse}:`, error);
          failCount++;
        }
        
        // Update progress
        setDownloadProgress({ current: verse, total: TOTAL_VERSES, recitor: recitor.name, format });
        
        // Small delay to avoid overwhelming the server
        if (verse % 50 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Add a README file with information
      const readme = `Quran Audio Download - ${recitor.name}
Format: ${format}
Quality: ${formatInfo.kbs}kbps ${formatInfo.type.toUpperCase()}
Generated on: ${new Date().toISOString()}
Total verses: ${TOTAL_VERSES}
Successfully downloaded: ${successCount}
Failed downloads: ${failCount}

Recitor Information:
- Name: ${recitor.name}
- Language: ${recitor.language}
- Type: ${recitor.type}

For more information, visit: https://globalquran.com/
Audio source: https://audio.globalquran.com/${recitor.id}/${formatType}/${kbs}kbs/
`;
      
      folder.file('README.txt', readme);
      
      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `quran-audio-${recitor.id}-${format}-${new Date().toISOString().split('T')[0]}.zip`);
      
      setDownloadProgress(null);
      alert(`Download complete! ${successCount} verses downloaded successfully.${failCount > 0 ? ` ${failCount} verses failed to download.` : ''}`);
      
    } catch (error) {
      console.error('Error creating audio zip file:', error);
      setDownloadProgress(null);
      alert('Error creating download file. Please try again.');
    }
  };

  const generateVerseLinks = (recitor, format) => {
    if (!recitor.media[format]) return [];
    
    const formatInfo = recitor.media[format];
    const formatType = formatInfo.type || 'mp3';
    const kbs = formatInfo.kbs || '128';
    const links = [];
    
    for (let verse = 1; verse <= TOTAL_VERSES; verse++) {
      links.push({
        verse,
        url: formatAudioUrl(recitor.id, formatType, kbs, verse)
      });
    }
    
    return links;
  };

  return (
    <div className="row" id="top">
      <div className="col-md-12">
        <h1>Quran Audio Recitors</h1>
        <p className="lead">Download verse-by-verse audio recitations of the Quran by renowned recitors.</p>
        
        {loading && (
          <div className="alert alert-info text-center">
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h4>Loading Recitor Data...</h4>
            <p>Please wait while we fetch the latest audio recitors from the API.</p>
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
        
        {downloadProgress && (
          <div className="alert alert-warning">
            <h4>Download in Progress</h4>
            <p>
              Downloading {downloadProgress.recitor} ({downloadProgress.format})...
              <br />
              Progress: {downloadProgress.current} / {downloadProgress.total} verses
            </p>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              height: '20px',
              marginTop: '10px'
            }}>
              <div style={{
                width: `${(downloadProgress.current / downloadProgress.total) * 100}%`,
                backgroundColor: '#b99c45',
                height: '100%',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
        
        {!loading && !error && recitorData.length === 0 && (
          <div className="alert alert-warning">
            <h4>No Recitors Available</h4>
            <p>No audio recitors found. Please check back later.</p>
          </div>
        )}

        {!loading && !error && recitorData.length > 0 && (
          <div>
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Recitor</th>
                  <th>Type</th>
                  <th>Available Formats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                                {recitorData.map((recitor) => (
                  <React.Fragment key={recitor.id}>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div>
                            <strong>{recitor.name}</strong>
                            {recitor.localName && recitor.localName !== recitor.name && (
                              <div>
                                <small className="text-muted">{recitor.localName}</small>
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              className={`btn ${playingRecitor === recitor.id ? 'btn-danger' : 'btn-success'} btn-lg`}
                              onClick={() => toggleAudio(recitor.id)}
                              style={{ 
                                borderRadius: '50%', 
                                width: '50px', 
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={playingRecitor === recitor.id ? 'Stop Demo' : 'Play Demo (Verse 1)'}
                            >
                              <i className={`fas ${playingRecitor === recitor.id ? 'fa-stop' : 'fa-play'}`}></i>
                            </button>
                            <audio
                              ref={(element) => {
                                if (element) {
                                  audioRefs.current[recitor.id] = element;
                                } else {
                                  delete audioRefs.current[recitor.id];
                                }
                              }}
                              src={getDemoAudioUrl(recitor)}
                              onEnded={() => handleAudioEnded(recitor.id)}
                              preload="none"
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">{recitor.type}</span>
                      </td>
                      <td>
                        {Object.entries(recitor.media).map(([format, info]) => (
                          <div key={format} style={{ marginBottom: '5px' }}>
                            <strong>{format}:</strong> {info.kbs}kbps {info.type.toUpperCase()}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="btn-group-vertical" style={{ width: '100%' }}>
                          {Object.keys(recitor.media).map((format) => (
                            <button
                              key={format}
                              className="btn btn-primary btn-sm"
                              onClick={() => downloadAllVerses(recitor, format)}
                              disabled={downloadProgress !== null}
                              title={`Download all ${TOTAL_VERSES} verses as ${format}`}
                              style={{ marginBottom: '5px' }}
                            >
                              <i className="fas fa-download"></i> Download All ({format})
                            </button>
                          ))}
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => setSelectedRecitor(selectedRecitor === recitor.id ? null : recitor.id)}
                            title="Show individual verse links"
                          >
                            <i className="fas fa-volume-up"></i> {selectedRecitor === recitor.id ? 'Hide Links' : 'Show Links'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedRecitor === recitor.id && (
                      <tr>
                        <td colSpan="4" style={{ backgroundColor: '#f9f9f9', padding: '15px' }}>
                          <h4>Individual Links - {recitor.name}</h4>
                          {Object.entries(recitor.media).map(([format, info]) => (
                            <div key={format} style={{ marginBottom: '20px' }}>
                              <h5>{format} ({info.kbs}kbps {info.type.toUpperCase()})</h5>
                              <div style={{ 
                                maxHeight: '400px', 
                                overflowY: 'auto', 
                                overflowX: 'hidden',
                                border: '1px solid #ddd', 
                                padding: '15px',
                                backgroundColor: '#fff',
                                fontSize: '12px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                                gap: '8px',
                                WebkitOverflowScrolling: 'touch'
                              }}>
                                {generateVerseLinks(recitor, format).map(link => (
                                  <a 
                                    key={link.verse}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ 
                                      textDecoration: 'none', 
                                      fontSize: '11px',
                                      padding: '4px 8px',
                                      border: '1px solid #e0e0e0',
                                      borderRadius: '3px',
                                      textAlign: 'center',
                                      backgroundColor: '#f8f9fa',
                                      color: '#495057',
                                      transition: 'all 0.2s ease',
                                      display: 'block'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = '#007bff';
                                      e.target.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = '#f8f9fa';
                                      e.target.style.color = '#495057';
                                    }}
                                  >
                                    {link.verse}
                                  </a>
                                ))}
                              </div>
                              <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#666', fontSize: '12px' }}>
                                Total: {TOTAL_VERSES} audio files available for download
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="alert alert-info" style={{ marginTop: '20px' }}>
              <h4>About Audio Downloads</h4>
              <p>
                This page provides access to verse-by-verse Quran audio recitations. Each recitor may offer different audio formats and quality levels.
              </p>
              <ul>
                <li><strong>Download All:</strong> Downloads all {TOTAL_VERSES} verses as a ZIP file</li>
                <li><strong>Show Links:</strong> Displays individual verse URLs for selective downloading</li>
                <li><strong>Format Options:</strong> Different audio qualities (32kbps, 64kbps, 128kbps, 192kbps) and formats (MP3, OGG)</li>
              </ul>
              <p>
                <strong>Note:</strong> Full downloads may take several minutes depending on your internet connection and the selected quality.
              </p>
            </div>
          </div>
        )}

        <hr />

        <Footer />
      </div>
    </div>
  );
};

export default AudioPage; 