import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DataPage from './pages/DataPage';
import AudioPage from './pages/AudioPage';
import AssetsPage from './pages/AssetsPage';
import DocsPage from './pages/DocsPage';
import ExamplePage from './pages/ExamplePage';
import DonatePage from './pages/DonatePage';

function App() {
  return (
    <Provider store={store}>
      <Router basename="/">
        <div className="App">
          <div id="container" className="container">
            <Header />
            <Navigation />
            <Routes>
              <Route path="/" element={<DocsPage />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/audio" element={<AudioPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/examples/:exampleName" element={<ExamplePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
