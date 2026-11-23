import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import './styles/gq.css';
import Bar from './gq/Bar';
import Meta from './gq/Meta';
import Foot from './gq/Foot';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ApiLandingPage from './pages/ApiLandingPage';
import ApiReferencePage from './pages/ApiReferencePage';
import EmbedPage from './pages/EmbedPage';
import DataPage from './pages/DataPage';
import AudioPage from './pages/AudioPage';
import AssetsPage from './pages/AssetsPage';
import PdfPage from './pages/PdfPage';
import DonatePage from './pages/DonatePage';
import ExamplePage from './pages/ExamplePage';
import ExamplesHomePage from './pages/ExamplesHomePage';
import AIInstructionsPage from './pages/AIInstructionsPage';
import McpPage, { McpPrivacyPage } from './pages/McpPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ApiShell from './gq/ApiShell';
import Protected from './keys/Protected';
import KeysHome from './keys/KeysHome';
import GetKey from './keys/GetKey';
import AllKeys from './keys/AllKeys';

const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// The older pages (AI instructions, about, contact, code examples) still use the Bootstrap look; they sit in a light card.
const Legacy = ({ children }) => <div className="gq-legacy gq-noprint container">{children}</div>;

function App() {
  return (
    <Provider store={store}>
      <Router basename="/">
        <ScrollTop />
        <Meta />
        <div className="gqapp">
          <Bar />
          <div className="gq-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route element={<ApiShell />}>
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/api" element={<ApiLandingPage />} />
                <Route path="/api/reference" element={<ApiReferencePage />} />
                <Route path="/api/reference/:slug" element={<ApiReferencePage />} />
                <Route path="/keys" element={<Protected><KeysHome /></Protected>} />
                <Route path="/keys/start" element={<Protected><GetKey /></Protected>} />
                <Route path="/keys/all" element={<Protected><AllKeys /></Protected>} />
              </Route>
              <Route path="/embed" element={<EmbedPage />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/audio" element={<AudioPage />} />
              <Route path="/mcp" element={<McpPage />} />
              <Route path="/mcp/privacy" element={<McpPrivacyPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/pdf" element={<PdfPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/examples" element={<Legacy><ExamplesHomePage /></Legacy>} />
              <Route path="/examples/:exampleName" element={<Legacy><ExamplePage /></Legacy>} />
              <Route path="/ai-instructions" element={<Legacy><AIInstructionsPage /></Legacy>} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
          <Foot />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
