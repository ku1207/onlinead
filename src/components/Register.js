import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    
    // 기본 유효성 검사
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.name) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    // 이메일 형식 검증 (입력된 경우에만)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return;
      }
    }
    
    // 회원가입 로직 (실제 환경에서는 서버에 전송)
    console.log('회원가입 데이터:', formData);
    
    // 성공 모달 표시
    setError('');
    setShowSuccessModal(true);
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h2>회원가입</h2>
          <p>새 계정을 만들어보세요</p>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">아이디 *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력해 주세요."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">비밀번호 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해 주세요."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">이름 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력해 주세요."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="연락처를 입력해 주세요."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력해 주세요."
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="register-button">
            회원가입
          </button>
        </form>
        
        <div className="register-footer">
          <button type="button" className="back-to-login" onClick={handleBackToLogin}>
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
      
      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>회원가입 완료</h3>
            <div className="modal-content">
              <p>회원가입이 완료되었습니다.</p>
              <p>로그인 화면으로 이동합니다.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="confirm-button"
                onClick={handleSuccessConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register; 