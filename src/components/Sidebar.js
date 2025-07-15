import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [advertiser, setAdvertiser] = useState('A광고주');
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: '대시보드', path: '/dashboard' },
    { id: 'daily-data', name: '일자별 데이터', path: '/daily-data' },
    { id: 'keyword-data', name: '매체 합산 데이터', path: '/keyword-data' },
    { id: 'media-data', name: '매체별 데이터', path: '/media-data' }
  ];

  const mediaPlatforms = [
    { id: 'naver', name: '네이버', path: '/media-data/naver' },
    { id: 'kakao', name: '카카오', path: '/media-data/kakao' },
    { id: 'google', name: '구글', path: '/media-data/google' },
    { id: 'facebook', name: '페이스북', path: '/media-data/facebook' },
    { id: 'tiktok', name: '틱톡', path: '/media-data/tiktok' }
  ];

  const handleMenuClick = (item) => {
    if (item.id === 'media-data') {
      setIsMediaExpanded(!isMediaExpanded);
    } else {
      navigate(item.path);
    }
  };

  const handlePlatformClick = (platform) => {
    navigate(platform.path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>광고 관리 시스템</h2>
      </div>
      
      <div className="user-info">
        <div className="user-id">
          <label>아이디</label>
          <span>{user.id}</span>
        </div>
        <div className="user-type">
          <span className="badge">{user.type}</span>
          <button className="logout-button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="advertiser-select">
        <label>광고주 계정:</label>
        <select 
          value={advertiser} 
          onChange={(e) => setAdvertiser(e.target.value)}
        >
          <option value="A광고주">A광고주</option>
          <option value="B광고주">B광고주</option>
          <option value="C광고주">C광고주</option>
        </select>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                {item.name}
                {item.id === 'media-data' && (
                  <span className={`expand-icon ${isMediaExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                )}
              </button>
              
              {item.id === 'media-data' && (
                <div className={`submenu ${isMediaExpanded ? 'expanded' : ''}`}>
                  <ul>
                    {mediaPlatforms.map((platform) => (
                      <li key={platform.id}>
                        <button
                          className={`nav-button submenu-button ${location.pathname === platform.path ? 'active' : ''}`}
                          onClick={() => handlePlatformClick(platform)}
                        >
                          {platform.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 