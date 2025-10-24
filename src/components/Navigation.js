import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to determine if a path is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
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
            <li><a href="https://globalquran.com/" target="_blank" rel="noopener noreferrer">Home</a></li>
            <li className={isActive('/') ? 'active' : ''}><Link to="/">Documentation</Link></li>
            <li className={isActive('/examples') ? 'active' : ''}><Link to="/examples">Code Examples</Link></li>
            <li className={isActive('/ai-instructions') ? 'active' : ''}>
              <Link to="/ai-instructions">
                AI Instructions
                <span className="badge badge-warning" style={{ 
                  marginLeft: '8px', 
                  fontSize: '9px', 
                  padding: '2px 6px',
                  background: '#ffc107',
                  color: '#000',
                  borderRadius: '10px',
                  fontWeight: 'bold'
                }}>
                  NEW
                </span>
              </Link>
            </li>
            <li className={isActive('/data') ? 'active' : ''}><Link to="/data">Download Data</Link></li>
            <li className={isActive('/audio') ? 'active' : ''}><Link to="/audio">Audio</Link></li>
            <li className={isActive('/assets') ? 'active' : ''}><Link to="/assets">Assets</Link></li>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li className={isActive('/donate') ? 'active' : ''}><Link to="/donate">Why Donate?</Link></li>
            <li className={isActive('/donate') ? 'active' : ''} style={{ paddingTop: '5px' }}>
              <Link 
                to="/donate" 
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #b99c45 0%, #a08935 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                <i className="fas fa-heart" style={{ marginRight: '5px' }}></i> Donate Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 