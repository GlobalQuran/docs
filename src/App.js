import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import DataPage from './pages/DataPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div id="container" className="container">
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
