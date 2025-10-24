import React from 'react';

const Header = () => {
  return (
    <div className="clearfix" style={{ marginBottom: '20px' }}>
      <div id="logo">
        <a href="https://GlobalQuran.com" title="Global Quran">
          <img src="/logo-alternate.png" alt="logo" />
        </a>
      </div>

      <div className="pull-right" style={{ marginTop: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <a 
            href="https://app.globalquran.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3d6f 100%)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
            }}
          >
            <i className="fas fa-key" style={{ marginRight: '8px' }}></i>
            Get API Key
          </a>
          <br />
          Download GlobalQuran Code:<br />
          V3: <a href="https://github.com/GlobalQuran/site/archive/v3.4.0.zip">
            <i className="fas fa-download fa-lg"></i>
          </a>
          <a href="https://github.com/GlobalQuran/site/tree/v3.4.0">
            <i className="fab fa-github fa-lg"></i>
          </a>
          <br /><br />
          <a href="https://github.com/GlobalQuran/site/stargazers" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://img.shields.io/github/stars/GlobalQuran/site?style=social" 
              alt="GitHub Stars"
              title="GitHub Stars"
            />
          </a>
          <a href="https://github.com/GlobalQuran/site/network/members" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px' }}>
            <img 
              src="https://img.shields.io/github/forks/GlobalQuran/site?style=social" 
              alt="GitHub Forks"
              title="GitHub Forks"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header; 