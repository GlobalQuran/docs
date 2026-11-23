import React from 'react';
import { Link } from 'react-router-dom';
import { GITHUB } from './ui';

const Foot = () => (
  <div className="gq-new gq-noprint">
    <div className="foot">
      <div className="in">
        <div><h4>Build</h4><Link to="/api">API</Link><Link to="/mcp">MCP for AI assistants</Link><Link to="/embed">Embed</Link><Link to="/how-it-works">How it works</Link><Link to="/ai-instructions">AI instructions</Link></div>
        <div><h4>Resources</h4><Link to="/data">Data</Link><Link to="/audio">Audio</Link><Link to="/assets">Assets</Link><Link to="/pdf">Quran PDF</Link></div>
        <div><h4>Project</h4><Link to="/about">About</Link><Link to="/contact">Contact</Link><a href={GITHUB}>GitHub</a><Link to="/donate">Donate</Link></div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h4>GlobalQuran</h4>
          <div>Free to use. No ads, no tracking.</div>
          <div style={{ marginTop: 6 }}>© <a style={{ display: 'inline' }} href="https://globalquran.com/">GlobalQuran.com</a> {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  </div>
);

export default Foot;
