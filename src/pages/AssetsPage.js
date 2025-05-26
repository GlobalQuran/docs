import React from 'react';

const AssetsPage = () => {
  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="row" id="top">
      <div className="col-md-12">
        <h1>Quran Assets</h1>
        <p className="lead">Download useful Quran resources including fonts and images.</p>
        
        <div className="row" style={{ marginTop: '30px' }}>
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">
                  <i className="fas fa-font"></i> Quran Fonts
                </h3>
              </div>
              <div className="panel-body">
                <p>
                  Collection of beautiful Arabic fonts specifically designed for Quran text display.
                  These fonts ensure proper rendering of Arabic text and Quranic symbols.
                </p>
                <ul className="list-unstyled">
                  <li><strong>Formats:</strong> TTF, OTF</li>
                  <li><strong>Encoding:</strong> Unicode</li>
                  <li><strong>Compatibility:</strong> Windows, Mac, Linux</li>
                  <li><strong>License:</strong> Free for personal and commercial use</li>
                </ul>
                <button 
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => handleDownload('https://audio.globalquran.com/resources/quran-fonts.zip', 'quran-fonts.zip')}
                >
                  <i className="fas fa-download"></i> Download Quran Fonts
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">
                  <i className="fas fa-image"></i> Ayah Images
                </h3>
              </div>
              <div className="panel-body">
                <p>
                  Complete collection of 6,236 individual verse (ayah) images in high quality.
                  Each image contains the Arabic text of a single verse.
                </p>
                <ul className="list-unstyled">
                  <li><strong>Total Images:</strong> 6,236 verses</li>
                  <li><strong>Format:</strong> PNG</li>
                  <li><strong>Quality:</strong> High resolution</li>
                  <li><strong>Text:</strong> Arabic (Uthmani script)</li>
                </ul>
                <button 
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => handleDownload('https://audio.globalquran.com/resources/quran-ayah-images.zip', 'quran-ayah-images.zip')}
                >
                  <i className="fas fa-download"></i> Download Ayah Images
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: '30px' }}>
          <h4>Usage Guidelines</h4>
          <p>
            These resources are provided free of charge for educational, personal, and commercial use. 
            When using these assets in your projects:
          </p>
          <ul>
            <li>Please maintain respect for the sacred nature of the Quranic content</li>
            <li>Ensure proper attribution when required by the specific license</li>
            <li>Test fonts thoroughly in your target environment</li>
            <li>Consider the file size when using images in web applications</li>
          </ul>
        </div>

        <div className="alert alert-warning" style={{ marginTop: '20px' }}>
          <h4>Technical Notes</h4>
          <ul>
            <li><strong>Fonts:</strong> Some fonts may require additional language packs for proper rendering</li>
            <li><strong>Images:</strong> Large download size (~50MB+) - ensure stable internet connection</li>
            <li><strong>Compatibility:</strong> Test in your target application before deploying</li>
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

export default AssetsPage; 