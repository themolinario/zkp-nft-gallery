import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NFTProvider } from './contexts/NFTContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import DashboardPage from './pages/DashboardPage';
import CollectionsPage from './pages/CollectionsPage';
import './App.css';

function App() {
  return (
    <NFTProvider>
      <Router>
        <div className="App">
          <Navigation />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
            </Routes>
          </main>

          <footer className="App-footer">
            <p>
              Powered by React Three Fiber + SnarkJS |
              Multi-page ZKP NFT Gallery Experience
            </p>
          </footer>
        </div>
      </Router>
    </NFTProvider>
  );
}

export default App;
