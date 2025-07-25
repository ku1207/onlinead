import React, { useEffect, useState } from 'react';
import './ApiManagement.css';

const ApiManagement = () => {
  const [advertiserName, setAdvertiserName] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // URL에서 광고주와 매체 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const advertiser = urlParams.get('advertiser');
    const media = urlParams.get('media');
    
    if (advertiser) setAdvertiserName(advertiser);
    if (media) setMediaName(media);
  }, []);

  const handleSaveSettings = () => {
    // 설정 저장 로직 (실제 구현 필요)
    setShowSuccessModal(true);
  };

  return (
    <div className="api-management">
      <div className="api-header">
        <h2>API 관리</h2>
        <div className="api-info">
          <span>광고주: {advertiserName}</span>
          <span>매체: {mediaName}</span>
        </div>
      </div>
      
      <div className="api-content">
        <div className="api-section">
          <h3>API 설정</h3>
          <div className="api-form">
            <div className="form-group">
              <label>API 키:</label>
              <input type="text" placeholder="API 키를 입력하세요" />
            </div>
            <div className="form-group">
              <label>API 엔드포인트:</label>
              <input type="text" placeholder="API 엔드포인트를 입력하세요" />
            </div>
            <div className="form-group">
              <label>인증 토큰:</label>
              <input type="text" placeholder="인증 토큰을 입력하세요" />
            </div>
          </div>
        </div>
        
        <div className="api-section">
          <h3>연결 상태</h3>
          <div className="connection-status">
            <span className="status-indicator disconnected"></span>
            <span>연결 끊김</span>
          </div>
        </div>
        
        <div className="api-actions">
          <button className="test-connection-button">연결 테스트</button>
          <button className="save-settings-button" onClick={handleSaveSettings}>설정 저장</button>
        </div>
      </div>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>저장 완료</h3>
            <div className="modal-content">
              <p>API 설정이 저장되었습니다.</p>
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

export default ApiManagement; 