import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DailyData from './components/DailyData';
import KeywordData from './components/KeywordData';
import MediaData from './components/MediaData';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <Sidebar user={user} onLogout={handleLogout} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/daily-data" element={<DailyData />} />
            <Route path="/keyword-data" element={<KeywordData />} />
            <Route path="/media-data" element={<MediaData />} />
            <Route path="/media-data/:platform" element={<MediaData />} />
            <Route path="/login" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 