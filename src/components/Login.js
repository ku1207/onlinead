import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 간단한 로그인 검증 (실제 환경에서는 서버에서 검증)
    if (formData.username === 'admin' && formData.password === 'admin123') {
      onLogin({
        id: 'admin@example.com',
        type: '관리자'
      });
      navigate('/dashboard');
    } else if (formData.username === 'user' && formData.password === 'user123') {
      onLogin({
        id: 'user@example.com',
        type: '사용자'
      });
      navigate('/dashboard');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>광고 실적확인 시스템</h2>
          <p>로그인하여 시스템을 이용하세요</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        
        <div className="login-footer">
          <button 
            type="button" 
            className="register-link-button"
            onClick={() => navigate('/register')}
          >
            회원가입
          </button>
        </div>
        
        <div className="login-info">
          <p>테스트 계정:</p>
          <p>관리자: admin / admin123</p>
          <p>사용자: user / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 