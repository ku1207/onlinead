import React, { useState } from 'react';
import './SettingsManagement.css';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('members');

  // 회원 관리 상태
  const [members, setMembers] = useState([
    { id: 1, username: 'admin', name: '관리자', type: '관리자', email: 'admin@example.com', password: 'admin123', phone: '010-1234-5678', active: true },
    { id: 2, username: 'user1', name: '사용자1', type: '사용자', email: 'user1@example.com', password: 'user123', phone: '010-2345-6789', active: true },
    { id: 3, username: 'user2', name: '사용자2', type: '사용자', email: 'user2@example.com', password: 'user456', phone: '010-3456-7890', active: false }
  ]);

  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // 광고주 관리 상태
  const [advertisers, setAdvertisers] = useState([
    {
      id: 1,
      name: 'A광고주',
      medias: [
        { id: 1, name: '네이버', active: true, key: 'naver_key_123' },
        { id: 2, name: '구글', active: false, key: 'google_key_456' }
      ]
    },
    {
      id: 2,
      name: 'B광고주',
      medias: [
        { id: 1, name: '카카오', active: true, key: 'kakao_key_789' }
      ]
    }
  ]);

  const [showAddAdvertiserModal, setShowAddAdvertiserModal] = useState(false);
  const [newAdvertiserName, setNewAdvertiserName] = useState('');
  const [showMediaManagementModal, setShowMediaManagementModal] = useState(false);
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  
  // 선택 가능한 매체 목록
  const mediaOptions = ['네이버', '카카오', '구글', '메타', '틱톡', 'GA'];

  // 회원 관리 함수들
  const handleEditMember = (member) => {
    setEditingMember(member);
    setEditFormData({
      username: member.username,
      name: member.name,
      type: member.type,
      email: member.email,
      password: member.password,
      phone: member.phone
    });
    setShowEditMemberModal(true);
    setShowPassword(false);
  };

  const handleSaveMember = () => {
    if (!editFormData.username || !editFormData.name || !editFormData.email || !editFormData.password || !editFormData.phone) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 전화번호 유효성 검사
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(editFormData.phone)) {
      alert('전화번호는 000-0000-0000 형식으로 입력해주세요.');
      return;
    }

    // 아이디 중복 검사 (현재 수정 중인 회원 제외)
    const isDuplicateUsername = members.some(member => 
      member.id !== editingMember.id && member.username === editFormData.username
    );
    if (isDuplicateUsername) {
      alert('이미 사용 중인 아이디입니다.');
      return;
    }

    // 이메일 중복 검사 (현재 수정 중인 회원 제외)
    const isDuplicateEmail = members.some(member => 
      member.id !== editingMember.id && member.email === editFormData.email
    );
    if (isDuplicateEmail) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }

    // 회원 정보 업데이트
    setMembers(prev => prev.map(member => {
      if (member.id === editingMember.id) {
        return {
          ...member,
          username: editFormData.username,
          name: editFormData.name,
          type: editFormData.type,
          email: editFormData.email,
          password: editFormData.password,
          phone: editFormData.phone
        };
      }
      return member;
    }));

    // 모달 닫기
    setShowEditMemberModal(false);
    setEditingMember(null);
    setEditFormData({});
    setShowPassword(false);
    alert('회원 정보가 성공적으로 수정되었습니다.');
  };

  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleMember = (memberId) => {
    setMembers(prev => prev.map(member => {
      if (member.id === memberId) {
        return { ...member, active: !member.active };
      }
      return member;
    }));
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('정말로 이 회원을 삭제하시겠습니까?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  // 광고주 관리 함수들
  const handleAddAdvertiser = () => {
    if (newAdvertiserName.trim()) {
      const newAdvertiser = {
        id: Date.now(),
        name: newAdvertiserName.trim(),
        medias: []
      };
      setAdvertisers([...advertisers, newAdvertiser]);
      setNewAdvertiserName('');
      setShowAddAdvertiserModal(false);
    }
  };

  const handleMediaManagement = (advertiser) => {
    setCurrentAdvertiser(advertiser);
    setShowMediaManagementModal(true);
  };

  const handleDeleteAdvertiser = (advertiserId) => {
    if (window.confirm('정말로 이 광고주를 삭제하시겠습니까?')) {
      setAdvertisers(prev => prev.filter(advertiser => advertiser.id !== advertiserId));
    }
  };

  const handleAddMediaToAdvertiser = (advertiserId) => {
    const newMedia = {
      id: Date.now(),
      name: '',
      active: false,
      key: ''
    };
    
    setAdvertisers(prev => prev.map(advertiser => {
      if (advertiser.id === advertiserId) {
        return {
          ...advertiser,
          medias: [...advertiser.medias, newMedia]
        };
      }
      return advertiser;
    }));

    setCurrentAdvertiser(prev => ({
      ...prev,
      medias: [...prev.medias, newMedia]
    }));
  };

  const handleUpdateMedia = (mediaId, field, value) => {
    // 매체 Key가 비어있으면 자동으로 OFF 처리
    if (field === 'key') {
      const shouldTurnOff = !value || value.trim().length === 0;
      
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentAdvertiser.id) {
          return {
            ...advertiser,
            medias: advertiser.medias.map(m => 
              m.id === mediaId ? { 
                ...m, 
                [field]: value,
                active: shouldTurnOff ? false : m.active 
              } : m
            )
          };
        }
        return advertiser;
      }));

      setCurrentAdvertiser(prev => ({
        ...prev,
        medias: prev.medias.map(m => 
          m.id === mediaId ? { 
            ...m, 
            [field]: value,
            active: shouldTurnOff ? false : m.active 
          } : m
        )
      }));
    } else {
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentAdvertiser.id) {
          return {
            ...advertiser,
            medias: advertiser.medias.map(m => 
              m.id === mediaId ? { ...m, [field]: value } : m
            )
          };
        }
        return advertiser;
      }));

      setCurrentAdvertiser(prev => ({
        ...prev,
        medias: prev.medias.map(m => 
          m.id === mediaId ? { ...m, [field]: value } : m
        )
      }));
    }
  };

  const handleDeleteMediaFromAdvertiser = (mediaId) => {
    if (window.confirm('정말로 이 매체를 삭제하시겠습니까?')) {
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentAdvertiser.id) {
          return {
            ...advertiser,
            medias: advertiser.medias.filter(m => m.id !== mediaId)
          };
        }
        return advertiser;
      }));

      setCurrentAdvertiser(prev => ({
        ...prev,
        medias: prev.medias.filter(m => m.id !== mediaId)
      }));
    }
  };

  const renderAdvertiserRows = () => {
    let rowNumber = 1;
    const rows = [];

    advertisers.forEach(advertiser => {
      rows.push(
        <tr key={advertiser.id}>
          <td>{rowNumber++}</td>
          <td>{advertiser.name}</td>
          <td>{advertiser.medias.map(media => media.name).join(', ') || '-'}</td>
          <td>
            <button 
              className="media-management-button"
              onClick={() => handleMediaManagement(advertiser)}
            >
              매체 관리
            </button>
            <button 
              className="delete-button"
              onClick={() => handleDeleteAdvertiser(advertiser.id)}
            >
              광고주 삭제
            </button>
          </td>
        </tr>
      );
    });

    return rows;
  };

  return (
    <div className="settings-management">
      <div className="settings-header">
        <h2>설정</h2>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          회원 관리
        </button>
        <button 
          className={`tab-button ${activeTab === 'advertisers' ? 'active' : ''}`}
          onClick={() => setActiveTab('advertisers')}
        >
          광고주 관리
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'members' && (
          <div className="member-management">
            <div className="section-header">
              <h3>회원 관리</h3>
            </div>
            <table className="member-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>아이디</th>
                  <th>이름</th>
                  <th>권한</th>
                  <th>이메일</th>
                  <th>활성화</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.id}>
                    <td>{index + 1}</td>
                    <td>{member.username}</td>
                    <td>{member.name}</td>
                    <td>
                      <span className={`badge ${member.type === '관리자' ? 'admin' : 'user'}`}>
                        {member.type}
                      </span>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={member.active}
                          onChange={() => handleToggleMember(member.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>
                      <button 
                        className="edit-button"
                        onClick={() => handleEditMember(member)}
                      >
                        수정
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'advertisers' && (
          <div className="advertiser-management">
            <div className="section-header">
              <h3>광고주 관리</h3>
              <button 
                className="add-advertiser-button"
                onClick={() => setShowAddAdvertiserModal(true)}
              >
                + 광고주 추가
              </button>
            </div>
            <table className="advertiser-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>광고주</th>
                  <th>매체</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {renderAdvertiserRows()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 회원 수정 모달 */}
      {showEditMemberModal && editingMember && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>회원 정보 수정</h3>
            <div className="modal-content">
              <div className="form-group">
                <label>아이디</label>
                <input
                  type="text"
                  value={editFormData.username || ''}
                  onChange={(e) => handleFormChange('username', e.target.value)}
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editFormData.password || ''}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    className="password-toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div className="form-group">
                <label>권한</label>
                <select
                  value={editFormData.type || ''}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                >
                  <option value="사용자">사용자</option>
                  <option value="관리자">관리자</option>
                </select>
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input
                  type="text"
                  value={editFormData.phone || ''}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  placeholder="000-0000-0000"
                />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowEditMemberModal(false);
                  setEditingMember(null);
                  setEditFormData({});
                  setShowPassword(false);
                }}
              >
                취소
              </button>
              <button 
                className="save-button"
                onClick={handleSaveMember}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 광고주 추가 모달 */}
      {showAddAdvertiserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>광고주 추가</h3>
            <div className="modal-content">
              <label>광고주</label>
              <input
                type="text"
                value={newAdvertiserName}
                onChange={(e) => setNewAdvertiserName(e.target.value)}
                placeholder="광고주명을 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddAdvertiser();
                  }
                }}
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowAddAdvertiserModal(false);
                  setNewAdvertiserName('');
                }}
              >
                취소
              </button>
              <button 
                className="save-button"
                onClick={handleAddAdvertiser}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 매체 관리 모달 */}
      {showMediaManagementModal && currentAdvertiser && (
        <div className="modal-overlay">
          <div className="modal media-management-modal">
            <h3>{currentAdvertiser.name} - 매체 관리</h3>
            <div className="modal-content">
              <table className="media-management-table">
                <thead>
                  <tr>
                    <th>매체</th>
                    <th>활성화</th>
                    <th>매체 Key</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdvertiser.medias.map(media => (
                    <tr key={media.id}>
                      <td>
                        <select
                          value={media.name}
                          onChange={(e) => handleUpdateMedia(media.id, 'name', e.target.value)}
                        >
                          <option value="">매체 선택</option>
                          {mediaOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={media.active}
                            onChange={() => handleUpdateMedia(media.id, 'active', !media.active)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={media.key || ''}
                          onChange={(e) => handleUpdateMedia(media.id, 'key', e.target.value)}
                          placeholder="매체 Key를 입력하세요"
                        />
                      </td>
                      <td>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteMediaFromAdvertiser(media.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="media-table-actions">
                <button 
                  className="add-media-button"
                  onClick={() => handleAddMediaToAdvertiser(currentAdvertiser.id)}
                >
                  + 매체 추가
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowMediaManagementModal(false);
                  setCurrentAdvertiser(null);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement; 