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
  const [showPassword, setShowPassword] = useState(false);

  // 광고주 관리 상태
  const [advertisers, setAdvertisers] = useState([
    {
      id: 1,
      name: 'A광고주',
      medias: [
        { id: 1, name: '네이버', active: true },
        { id: 2, name: '구글', active: false }
      ]
    },
    {
      id: 2,
      name: 'B광고주',
      medias: [
        { id: 1, name: '카카오', active: true }
      ]
    }
  ]);

  const [showAddAdvertiserModal, setShowAddAdvertiserModal] = useState(false);
  const [newAdvertiserName, setNewAdvertiserName] = useState('');
  const [addingMediaFor, setAddingMediaFor] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState('');
  
  // 선택 가능한 매체 목록
  const mediaOptions = ['네이버', '카카오', '구글', '메타', '틱톡', 'GA'];

  // 회원 관리 함수들
  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowEditMemberModal(true);
    setShowPassword(false);
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

  const handleAddMedia = (advertiserId) => {
    if (selectedMedia.trim()) {
      setAdvertisers(prev => prev.map(advertiser => {
        if (advertiser.id === advertiserId) {
          return {
            ...advertiser,
            medias: [...advertiser.medias, {
              id: Date.now(),
              name: selectedMedia.trim(),
              active: false
            }]
          };
        }
        return advertiser;
      }));
      setSelectedMedia('');
      setAddingMediaFor(null);
    }
  };

  const handleToggleMedia = (advertiserId, mediaId) => {
    setAdvertisers(prev => prev.map(advertiser => {
      if (advertiser.id === advertiserId) {
        return {
          ...advertiser,
          medias: advertiser.medias.map(media => {
            if (media.id === mediaId) {
              return { ...media, active: !media.active };
            }
            return media;
          })
        };
      }
      return advertiser;
    }));
  };

  const handleApiManagement = (advertiser, media) => {
    // 새 창에서 API 관리 페이지 열기
    const apiUrl = `/api-management?advertiser=${encodeURIComponent(advertiser.name)}&media=${encodeURIComponent(media.name)}`;
    window.open(apiUrl, '_blank', 'width=800,height=600');
  };

  const handleDeleteAdvertiser = (advertiserId) => {
    if (window.confirm('정말로 이 광고주를 삭제하시겠습니까?')) {
      setAdvertisers(prev => prev.filter(advertiser => advertiser.id !== advertiserId));
    }
  };

  const renderAdvertiserRows = () => {
    let rowNumber = 1;
    const rows = [];

    advertisers.forEach(advertiser => {
      if (advertiser.medias.length === 0) {
        // 매체가 없는 경우
        rows.push(
          <tr key={`${advertiser.id}-empty`}>
            <td>{rowNumber++}</td>
            <td>{advertiser.name}</td>
            <td>
              <div className="media-actions">
                <button 
                  className="add-media-button"
                  onClick={() => setAddingMediaFor(advertiser.id)}
                >
                  + 매체 추가
                </button>
                {addingMediaFor === advertiser.id && (
                  <div className="media-input">
                    <select
                      value={selectedMedia}
                      onChange={(e) => setSelectedMedia(e.target.value)}
                    >
                      <option value="">매체 선택</option>
                      {mediaOptions.map(media => (
                        <option key={media} value={media}>{media}</option>
                      ))}
                    </select>
                    <button onClick={() => handleAddMedia(advertiser.id)}>추가</button>
                    <button onClick={() => setAddingMediaFor(null)}>취소</button>
                  </div>
                )}
              </div>
            </td>
            <td>-</td>
            <td>
              <button 
                className="delete-button"
                onClick={() => handleDeleteAdvertiser(advertiser.id)}
              >
                삭제
              </button>
            </td>
          </tr>
        );
      } else {
        // 매체가 있는 경우
        advertiser.medias.forEach((media, index) => {
          rows.push(
            <tr key={`${advertiser.id}-${media.id}`}>
              <td>{rowNumber++}</td>
              <td>{index === 0 ? advertiser.name : ''}</td>
              <td>
                <div className="media-cell">
                  <span>{media.name}</span>
                  {index === 0 && (
                    <div className="media-actions">
                      <button 
                        className="add-media-button"
                        onClick={() => setAddingMediaFor(advertiser.id)}
                      >
                        + 매체 추가
                      </button>
                      {addingMediaFor === advertiser.id && (
                        <div className="media-input">
                          <select
                            value={selectedMedia}
                            onChange={(e) => setSelectedMedia(e.target.value)}
                          >
                            <option value="">매체 선택</option>
                            {mediaOptions.map(media => (
                              <option key={media} value={media}>{media}</option>
                            ))}
                          </select>
                          <button onClick={() => handleAddMedia(advertiser.id)}>추가</button>
                          <button onClick={() => setAddingMediaFor(null)}>취소</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={media.active}
                    onChange={() => handleToggleMedia(advertiser.id, media.id)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td>
                <button 
                  className="api-management-button"
                  onClick={() => handleApiManagement(advertiser, media)}
                >
                  API 관리
                </button>
                {index === 0 && (
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteAdvertiser(advertiser.id)}
                  >
                    삭제
                  </button>
                )}
              </td>
            </tr>
          );
        });
      }
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
                  <th>활성화</th>
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
            <h3>회원 정보 확인</h3>
            <div className="modal-content">
              <div className="form-group">
                <label>아이디</label>
                <input
                  type="text"
                  value={editingMember.username}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={editingMember.password}
                    readOnly
                    className="readonly-input"
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
                <label>연락처</label>
                <input
                  type="text"
                  value={editingMember.phone}
                  readOnly
                  className="readonly-input"
                />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={editingMember.email}
                  readOnly
                  className="readonly-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowEditMemberModal(false);
                  setEditingMember(null);
                  setShowPassword(false);
                }}
              >
                확인
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
    </div>
  );
};

export default SettingsManagement; 