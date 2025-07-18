import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || user?.id || '',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    password: user?.password || '',
    type: user?.type || '사용자',
    active: user?.active !== false
  });

  if (!user) {
    return (
      <div className="user-profile">
        <div className="profile-header">
          <h2>사용자 정보를 불러올 수 없습니다</h2>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      username: user.username || user.id || '',
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      password: user.password || '',
      type: user.type || '사용자',
      active: user.active !== false
    });
  };

  const handleSave = () => {
    // 여기에 실제 저장 로직을 구현
    console.log('저장할 데이터:', editData);
    setShowSuccessModal(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: user.username || user.id || '',
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      password: user.password || '',
      type: user.type || '사용자',
      active: user.active !== false
    });
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>내 정보</h2>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3>계정 정보</h3>
            <div>
              {isEditing ? (
                <>
                  <button 
                    className="save-button"
                    onClick={handleSave}
                    style={{ marginRight: '8px' }}
                  >
                    저장
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                </>
              ) : (
                <button 
                  className="edit-button"
                  onClick={handleEdit}
                >
                  수정
                </button>
              )}
            </div>
          </div>
          <div className="profile-info">
            <div className="info-group">
              <label>아이디</label>
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="아이디를 입력하세요"
                />
              ) : (
                <div className="info-value readonly">
                  {user.username || user.id}
                </div>
              )}
            </div>
            
            <div className="info-group">
              <label>비밀번호</label>
              {isEditing ? (
                <input
                  type={showPassword ? "text" : "password"}
                  className="edit-input"
                  value={editData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              ) : (
                <div className="password-display">
                  <div className="info-value readonly">
                    {showPassword ? (user.password || '••••••••') : '••••••••'}
                  </div>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="info-group">
              <label>이름</label>
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              ) : (
                <div className="info-value readonly">
                  {user.name || '정보 없음'}
                </div>
              )}
            </div>
            
            <div className="info-group">
              <label>권한</label>
              <select
                className="edit-select"
                value={isEditing ? editData.type : user.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                disabled={!isEditing}
              >
                <option value="사용자">사용자</option>
                <option value="관리자">관리자</option>
              </select>
            </div>
            
            <div className="info-group">
              <label>연락처</label>
              {isEditing ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="000-0000-0000"
                />
              ) : (
                <div className="info-value readonly">
                  {user.phone || '정보 없음'}
                </div>
              )}
            </div>
            
            <div className="info-group">
              <label>이메일</label>
              {isEditing ? (
                <input
                  type="email"
                  className="edit-input"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              ) : (
                <div className="info-value readonly">
                  {user.email || '정보 없음'}
                </div>
              )}
            </div>
            
            <div className="info-group">
              <label>계정 상태</label>
              <div className="info-value">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isEditing ? editData.active : (user.active !== false)}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>저장 완료</h3>
            <div className="modal-content">
              <p>정보가 저장되었습니다.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="save-button"
                onClick={() => setShowSuccessModal(false)}
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

export default UserProfile; 