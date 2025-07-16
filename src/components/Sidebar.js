import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [advertiser, setAdvertiser] = useState('A광고주');

  const menuItems = [
    { id: 'keyword-data', name: '매체 합산 데이터', path: '/keyword-data' },
    ...(user.type === '관리자' ? [
      { id: 'settings-management', name: '설정', path: '/settings-management' }
    ] : [])
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>광고 실적확인 시스템</h2>
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
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 