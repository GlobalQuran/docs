import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="navbar navbar-default" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button 
            type="button" 
            className="navbar-toggle" 
            onClick={toggleNavbar}
            aria-expanded={!isCollapsed}
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse navbar-ex1-collapse ${!isCollapsed ? 'in' : ''}`}>
          <ul className="nav navbar-nav">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/data">Download</Link></li>
            <li><a href="https://docs.globalquran.com/" target="_blank" rel="noopener noreferrer">API</a></li>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li><a href="https://globalquran.com/donate/" target="_blank" rel="noopener noreferrer">Why Donate?</a></li>
            <li style={{ paddingTop: '5px' }}>
              <button 
                onClick={() => window.open('/pay/donate-now.php', '_blank')} 
                className="btn btn-sm btn-primary"
              >
                <i className="icon-usd"></i> Donate
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 