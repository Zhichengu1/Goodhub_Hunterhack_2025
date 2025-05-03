import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import Profile from './components/Profile';
import Team from './components/team.jsx'


const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Team" element={<Team />} />



      </Routes>
    </Router>
  </StrictMode>
);
