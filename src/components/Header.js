import React from 'react';

const Header = () => {
  return (
    <div className="clearfix" style={{ marginBottom: '20px' }}>
      <div id="logo">
        <a href="/" title="Global Quran">
          <img src="/logo-alternate.png" alt="logo" />
        </a>
      </div>

      <div className="pull-right" style={{ marginTop: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          Download GlobalQuran Code:<br />
          V3: <a href="https://github.com/GlobalQuran/site/archive/v3.4.0.zip">
            <i className="icon-cloud-download icon-large"></i>
          </a>
          <a href="https://github.com/GlobalQuran/site/tree/v3.4.0">
            <i className="icon-github icon-large"></i>
          </a>
          <br /><br />
          <iframe 
            src="https://ghbtns.com/github-btn.html?user=GlobalQuran&repo=site&type=star&count=true" 
            allowTransparency="true" 
            frameBorder="0" 
            scrolling="0" 
            width="95" 
            height="20"
            title="GitHub Stars"
          />
          <iframe 
            src="https://ghbtns.com/github-btn.html?user=GlobalQuran&repo=site&type=fork&count=true" 
            allowTransparency="true" 
            frameBorder="0" 
            scrolling="0" 
            width="95" 
            height="20"
            title="GitHub Forks"
          />
        </div>
      </div>
    </div>
  );
};

export default Header; 