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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [showDeleteMediaModal, setShowDeleteMediaModal] = useState(false);
  const [deleteMediaId, setDeleteMediaId] = useState(null);
  const [showDeleteKpiModal, setShowDeleteKpiModal] = useState(false);
  const [deleteKpiId, setDeleteKpiId] = useState(null);
  const [showDeleteAdvertiserModal, setShowDeleteAdvertiserModal] = useState(false);
  const [deleteAdvertiserId, setDeleteAdvertiserId] = useState(null);

  // 광고주 관리 상태
  const [advertisers, setAdvertisers] = useState([
    {
      id: 1,
      name: 'A광고주',
      medias: [
        { id: 1, name: '네이버', active: true, key: 'naver_key_123' },
        { id: 2, name: '구글', active: false, key: 'google_key_456' }
      ],
      kpis: [
        { id: 1, name: '광고비', active: true, period: '기준월', targetValue: '1000000' },
        { id: 2, name: 'CPC', active: false, period: '기준월', targetValue: '500' },
        { id: 3, name: '전환수', active: true, period: '기준월', targetValue: '100' }
      ]
    },
    {
      id: 2,
      name: 'B광고주',
      medias: [
        { id: 1, name: '카카오', active: true, key: 'kakao_key_789' }
      ],
      kpis: [
        { id: 1, name: 'CPA', active: true, period: '기준월', targetValue: '5000' },
        { id: 2, name: 'CVR', active: false, period: '기준월', targetValue: '2.5' }
      ]
    }
  ]);

  const [showAddAdvertiserModal, setShowAddAdvertiserModal] = useState(false);
  const [newAdvertiserName, setNewAdvertiserName] = useState('');
  const [showMediaManagementModal, setShowMediaManagementModal] = useState(false);
  const [currentAdvertiser, setCurrentAdvertiser] = useState(null);
  
  // KPI 관리 모달 상태
  const [showKpiManagementModal, setShowKpiManagementModal] = useState(false);
  const [currentKpiAdvertiser, setCurrentKpiAdvertiser] = useState(null);
  
  // 선택 가능한 매체 목록
  const mediaOptions = ['네이버', '카카오', '구글', '메타', '틱톡'];
  
  // 선택 가능한 KPI 목록
  const kpiOptions = ['광고비', 'CPC', '전환수', 'CPA', 'CVR', '노출수', '클릭수', 'CTR'];
  
  // 선택 가능한 기간 목록
  const periodOptions = ['기준일', '전일', '최근 7일', '이전 7일', '기준월', '전월'];

  // 지표별 단위 반환 함수
  const getKpiUnit = (kpiName) => {
    const unitMap = {
      '광고비': '원',
      'CPC': '원',
      'CPA': '원',
      '전환수': '건',
      'CVR': '%',
      'CTR': '%',
      '노출수': '회',
      '클릭수': '회'
    };
    return unitMap[kpiName] || '';
  };

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
    if (!editFormData.username || !editFormData.name || !editFormData.password) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    // 이메일 유효성 검사 (입력된 경우에만)
    if (editFormData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editFormData.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }
    }

    // 전화번호 유효성 검사 (입력된 경우에만)
    if (editFormData.phone) {
      const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
      if (!phoneRegex.test(editFormData.phone)) {
        alert('전화번호는 000-0000-0000 형식으로 입력해주세요.');
        return;
      }
    }

    // 아이디 중복 검사 (현재 수정 중인 회원 제외)
    const isDuplicateUsername = members.some(member => 
      member.id !== editingMember.id && member.username === editFormData.username
    );
    if (isDuplicateUsername) {
      alert('이미 사용 중인 아이디입니다.');
      return;
    }

    // 이메일 중복 검사 (현재 수정 중인 회원 제외, 이메일이 입력된 경우에만)
    if (editFormData.email) {
      const isDuplicateEmail = members.some(member => 
        member.id !== editingMember.id && member.email === editFormData.email
      );
      if (isDuplicateEmail) {
        alert('이미 사용 중인 이메일입니다.');
        return;
      }
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
    setSuccessMessage('회원 정보가 성공적으로 수정되었습니다.');
    setShowSuccessModal(true);
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
    setDeleteMemberId(memberId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteMemberId) {
      setMembers(prev => prev.filter(member => member.id !== deleteMemberId));
      setSuccessMessage('회원이 성공적으로 삭제되었습니다.');
      setShowSuccessModal(true);
    }
    setShowDeleteConfirmModal(false);
    setDeleteMemberId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setDeleteMemberId(null);
  };

  // 광고주 관리 함수들
  const handleAddAdvertiser = () => {
    if (newAdvertiserName.trim()) {
      const newAdvertiser = {
        id: Date.now(),
        name: newAdvertiserName.trim(),
        medias: [],
        kpis: []
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

  const handleKpiManagement = (advertiser) => {
    setCurrentKpiAdvertiser(advertiser);
    setShowKpiManagementModal(true);
  };

  const handleAddKpiToAdvertiser = (advertiserId) => {
    const newKpi = {
      id: Date.now(),
      name: '',
      active: false,
      period: '기준월',
      targetValue: ''
    };
    
    setAdvertisers(prev => prev.map(advertiser => {
      if (advertiser.id === advertiserId) {
        return {
          ...advertiser,
          kpis: [...(advertiser.kpis || []), newKpi]
        };
      }
      return advertiser;
    }));

    setCurrentKpiAdvertiser(prev => ({
      ...prev,
      kpis: [...(prev.kpis || []), newKpi]
    }));
  };

  const handleUpdateKpi = (kpiId, field, value) => {
    // 목표값이 비어있으면 자동으로 OFF 처리
    if (field === 'targetValue') {
      // 숫자만 허용 (빈 값 또는 양수)
      if (value !== '' && (isNaN(value) || parseFloat(value) < 0)) {
        return;
      }
      
      const shouldTurnOff = !value || value.trim().length === 0;
      
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentKpiAdvertiser.id) {
          return {
            ...advertiser,
            kpis: advertiser.kpis.map(k => 
              k.id === kpiId ? { 
                ...k, 
                [field]: value,
                active: shouldTurnOff ? false : k.active 
              } : k
            )
          };
        }
        return advertiser;
      }));

      setCurrentKpiAdvertiser(prev => ({
        ...prev,
        kpis: prev.kpis.map(k => 
          k.id === kpiId ? { 
            ...k, 
            [field]: value,
            active: shouldTurnOff ? false : k.active 
          } : k
        )
      }));
    } else {
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentKpiAdvertiser.id) {
          return {
            ...advertiser,
            kpis: advertiser.kpis.map(k => 
              k.id === kpiId ? { ...k, [field]: value } : k
            )
          };
        }
        return advertiser;
      }));

      setCurrentKpiAdvertiser(prev => ({
        ...prev,
        kpis: prev.kpis.map(k => 
          k.id === kpiId ? { ...k, [field]: value } : k
        )
      }));
    }
  };

  const handleDeleteKpiFromAdvertiser = (kpiId) => {
    setDeleteKpiId(kpiId);
    setShowDeleteKpiModal(true);
  };

  const handleConfirmDeleteKpi = () => {
    if (deleteKpiId) {
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentKpiAdvertiser.id) {
          return {
            ...advertiser,
            kpis: advertiser.kpis.filter(k => k.id !== deleteKpiId)
          };
        }
        return advertiser;
      }));

      setCurrentKpiAdvertiser(prev => ({
        ...prev,
        kpis: prev.kpis.filter(k => k.id !== deleteKpiId)
      }));
      
      setSuccessMessage('지표가 성공적으로 삭제되었습니다.');
      setShowSuccessModal(true);
    }
    setShowDeleteKpiModal(false);
    setDeleteKpiId(null);
  };

  const handleCancelDeleteKpi = () => {
    setShowDeleteKpiModal(false);
    setDeleteKpiId(null);
  };

  const handleDeleteAdvertiser = (advertiserId) => {
    setDeleteAdvertiserId(advertiserId);
    setShowDeleteAdvertiserModal(true);
  };

  const handleConfirmDeleteAdvertiser = () => {
    if (deleteAdvertiserId) {
      setAdvertisers(prev => prev.filter(advertiser => advertiser.id !== deleteAdvertiserId));
      setSuccessMessage('광고주가 성공적으로 삭제되었습니다.');
      setShowSuccessModal(true);
    }
    setShowDeleteAdvertiserModal(false);
    setDeleteAdvertiserId(null);
  };

  const handleCancelDeleteAdvertiser = () => {
    setShowDeleteAdvertiserModal(false);
    setDeleteAdvertiserId(null);
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
    setDeleteMediaId(mediaId);
    setShowDeleteMediaModal(true);
  };

  const handleConfirmDeleteMedia = () => {
    if (deleteMediaId) {
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === currentAdvertiser.id) {
          return {
            ...advertiser,
            medias: advertiser.medias.filter(m => m.id !== deleteMediaId)
          };
        }
        return advertiser;
      }));

      setCurrentAdvertiser(prev => ({
        ...prev,
        medias: prev.medias.filter(m => m.id !== deleteMediaId)
      }));
      
      setSuccessMessage('매체가 성공적으로 삭제되었습니다.');
      setShowSuccessModal(true);
    }
    setShowDeleteMediaModal(false);
    setDeleteMediaId(null);
  };

  const handleCancelDeleteMedia = () => {
    setShowDeleteMediaModal(false);
    setDeleteMediaId(null);
  };

  // 매체 이름을 CSS 클래스명으로 변환
  const getMediaClassName = (mediaName) => {
    const mediaMap = {
      '네이버': 'naver',
      '카카오': 'kakao',
      '구글': 'google',
      '메타': 'meta',
      '틱톡': 'tiktok',
      'GA': 'ga'
    };
    return mediaMap[mediaName] || 'default';
  };

  // 매체 도형 렌더링 함수
  const renderMediaBadges = (medias) => {
    if (!medias || medias.length === 0) {
      return <div className="media-badges empty">-</div>;
    }

    // 매체 이름이 있는 것들만 필터링
    const validMedias = medias.filter(media => media.name && media.name.trim() !== '');
    
    if (validMedias.length === 0) {
      return <div className="media-badges empty">-</div>;
    }

    return (
      <div className="media-badges">
        {validMedias.map(media => (
          <span
            key={media.id}
            className={`media-badge ${getMediaClassName(media.name)} ${!media.active ? 'inactive' : ''}`}
          >
            {media.name}
          </span>
        ))}
      </div>
    );
  };

  // KPI 도형 렌더링 함수
  const renderKpiBadges = (kpis) => {
    if (!kpis || kpis.length === 0) {
      return <div className="kpi-badges empty">-</div>;
    }

    // KPI 이름이 있는 것들만 필터링
    const validKpis = kpis.filter(kpi => kpi.name && kpi.name.trim() !== '');
    
    if (validKpis.length === 0) {
      return <div className="kpi-badges empty">-</div>;
    }

    return (
      <div className="kpi-badges">
        {validKpis.map(kpi => (
          <span
            key={kpi.id}
            className={`kpi-badge ${!kpi.active ? 'inactive' : ''}`}
          >
            {kpi.name}
          </span>
        ))}
      </div>
    );
  };

  const renderAdvertiserRows = () => {
    let rowNumber = 1;
    const rows = [];

    advertisers.forEach(advertiser => {
      rows.push(
        <tr key={advertiser.id}>
          <td>{rowNumber++}</td>
          <td>{advertiser.name}</td>
          <td>{renderMediaBadges(advertiser.medias)}</td>
          <td>{renderKpiBadges(advertiser.kpis)}</td>
          <td>
            <button 
              className="media-management-button"
              onClick={() => handleMediaManagement(advertiser)}
            >
              매체 관리
            </button>
            <button 
              className="kpi-management-button"
              onClick={() => handleKpiManagement(advertiser)}
            >
              KPI 관리
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
                      <div className="user-type-badges">
                        <span className={`user-type-badge ${member.type === '관리자' ? 'admin' : 'user'}`}>
                        {member.type}
                      </span>
                      </div>
                    </td>
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
                  <th>KPI 설정 여부</th>
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
                <label>아이디 *</label>
                <input
                  type="text"
                  value={editFormData.username || ''}
                  onChange={(e) => handleFormChange('username', e.target.value)}
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>
              <div className="form-group">
                <label>비밀번호 *</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editFormData.password || ''}
                    onChange={(e) => handleFormChange('password', e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    required
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
                <label>이름 *</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="이름을 입력하세요"
                  required
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
                placeholder="광고주명을 입력해 주세요."
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
          <div className="modal media-management-modal" style={{ width: '800px', maxWidth: '95%', minWidth: '600px' }}>
            <h3>{currentAdvertiser.name} - 매체 관리</h3>
            <div className="modal-content">
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>현재 매체 상태</h4>
                {renderMediaBadges(currentAdvertiser.medias)}
              </div>
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

      {/* KPI 관리 모달 */}
      {showKpiManagementModal && currentKpiAdvertiser && (
        <div className="modal-overlay">
          <div className="modal media-management-modal" style={{ width: '800px', maxWidth: '95%', minWidth: '600px' }}>
            <h3>{currentKpiAdvertiser.name} - KPI 관리</h3>
            <div className="modal-content">
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>현재 KPI 상태</h4>
                {renderKpiBadges(currentKpiAdvertiser.kpis)}
              </div>
              <table className="media-management-table">
                <thead>
                  <tr>
                    <th>지표</th>
                    <th>활성화</th>
                    <th>기간</th>
                    <th>목표값</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentKpiAdvertiser.kpis.map(kpi => (
                    <tr key={kpi.id}>
                      <td>
                        <select
                          value={kpi.name}
                          onChange={(e) => handleUpdateKpi(kpi.id, 'name', e.target.value)}
                        >
                          <option value="">지표 선택</option>
                          {kpiOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={kpi.active}
                            onChange={() => handleUpdateKpi(kpi.id, 'active', !kpi.active)}
                          />
                          <span className="slider"></span>
                        </label>
                      </td>
                      <td>
                        <select
                          value={kpi.period || '기준월'}
                          onChange={(e) => handleUpdateKpi(kpi.id, 'period', e.target.value)}
                        >
                          {periodOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="target-value-container">
                          <input
                            type="number"
                            value={kpi.targetValue || ''}
                            onChange={(e) => handleUpdateKpi(kpi.id, 'targetValue', e.target.value)}
                            placeholder="목표값을 입력하세요"
                            min="0"
                            step="0.01"
                          />
                          {kpi.name && (
                            <span className="unit-label">{getKpiUnit(kpi.name)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteKpiFromAdvertiser(kpi.id)}
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
                  onClick={() => handleAddKpiToAdvertiser(currentKpiAdvertiser.id)}
                >
                  + 지표 추가
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowKpiManagementModal(false);
                  setCurrentKpiAdvertiser(null);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>회원 삭제</h3>
            <div className="modal-content">
              <p>정말로 이 회원을 삭제하시겠습니까?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleCancelDelete}
              >
                취소
              </button>
              <button 
                className="delete-button"
                onClick={handleConfirmDelete}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 매체 삭제 확인 모달 */}
      {showDeleteMediaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>매체 삭제</h3>
            <div className="modal-content">
              <p>정말로 이 매체를 삭제하시겠습니까?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleCancelDeleteMedia}
              >
                취소
              </button>
              <button 
                className="delete-button"
                onClick={handleConfirmDeleteMedia}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI 삭제 확인 모달 */}
      {showDeleteKpiModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>지표 삭제</h3>
            <div className="modal-content">
              <p>정말로 이 지표를 삭제하시겠습니까?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleCancelDeleteKpi}
              >
                취소
              </button>
              <button 
                className="delete-button"
                onClick={handleConfirmDeleteKpi}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 광고주 삭제 확인 모달 */}
      {showDeleteAdvertiserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>광고주 삭제</h3>
            <div className="modal-content">
              <p>정말로 이 광고주를 삭제하시겠습니까?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleCancelDeleteAdvertiser}
              >
                취소
              </button>
              <button 
                className="delete-button"
                onClick={handleConfirmDeleteAdvertiser}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>저장 완료</h3>
            <div className="modal-content">
              <p>{successMessage}</p>
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

export default SettingsManagement; 