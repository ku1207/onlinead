import React, { useState } from 'react';

const Dashboard = () => {
  const [showKpiModal, setShowKpiModal] = useState(false);
  const [isEditingKpi, setIsEditingKpi] = useState(false);
  const [kpiTargets, setKpiTargets] = useState({
    spend: 2000000,
    conversion: 200,
    cpa: 8000,
    cvr: 5.0,
    impressions: 60000,
    clicks: 4000
  });

  const todayData = {
    totalSpend: 1250000,
    totalClicks: 3420,
    totalImpressions: 45600,
    cpc: 365,
    ctr: 7.5,
    conversion: 128
  };

  const platformData = [
    { platform: '네이버', spend: 450000, clicks: 1200, impressions: 15000 },
    { platform: '구글', spend: 380000, clicks: 950, impressions: 12000 },
    { platform: '카카오', spend: 320000, clicks: 890, impressions: 11000 },
    { platform: '페이스북', spend: 70000, clicks: 250, impressions: 4200 },
    { platform: '틱톡', spend: 30000, clicks: 130, impressions: 3400 }
  ];

  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  const calculateAchievementRate = (current, target) => {
    return ((current / target) * 100).toFixed(1);
  };

  const handleKpiSave = () => {
    setIsEditingKpi(false);
    // 실제 저장 로직을 여기에 추가
  };

  const handleKpiCancel = () => {
    setIsEditingKpi(false);
    // 원래 값으로 복원하는 로직 추가 가능
  };

  const handleKpiTargetChange = (metric, value) => {
    setKpiTargets(prev => ({
      ...prev,
      [metric]: parseFloat(value) || 0
    }));
  };

  return (
    <div style={{ width: '85%', margin: '0 auto', padding: '20px 0' }}>
      <div className="content-header">
        <h1>대시보드</h1>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <h3>총 광고비</h3>
          <div className="metric">
            <span>오늘 집행</span>
            <strong>{formatNumber(todayData.totalSpend)}원</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>총 클릭수</h3>
          <div className="metric">
            <span>오늘 클릭</span>
            <strong>{formatNumber(todayData.totalClicks)}회</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>총 노출수</h3>
          <div className="metric">
            <span>오늘 노출</span>
            <strong>{formatNumber(todayData.totalImpressions)}회</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>평균 클릭단가</h3>
          <div className="metric">
            <span>CPC</span>
            <strong>{formatNumber(todayData.cpc)}원</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>클릭률</h3>
          <div className="metric">
            <span>CTR</span>
            <strong>{todayData.ctr}%</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>전환수</h3>
          <div className="metric">
            <span>오늘 전환</span>
            <strong>{formatNumber(todayData.conversion)}건</strong>
          </div>
        </div>
      </div>

      {/* 기간별 합산 데이터 영역 */}
      <div className="data-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>기간별 합산 데이터</h3>
          <button 
            onClick={() => setShowKpiModal(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            KPI 확인
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          {platformData.map((platform, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '10px 0',
              borderBottom: index < platformData.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <span style={{ fontWeight: 'bold', minWidth: '80px' }}>{platform.platform}</span>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                <span>광고비: {formatNumber(platform.spend)}원</span>
                <span>클릭: {formatNumber(platform.clicks)}회</span>
                <span>노출: {formatNumber(platform.impressions)}회</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI 달성률 팝업 */}
      {showKpiModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>KPI 달성률</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                {isEditingKpi ? (
                  <>
                    <button
                      onClick={handleKpiSave}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      저장
                    </button>
                    <button
                      onClick={handleKpiCancel}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingKpi(true)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    KPI 수정
                  </button>
                )}
                <button
                  onClick={() => setShowKpiModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* KPI 카드 그리드 (2행 3열) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {/* 광고비 카드 */}
              <div style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>광고비</h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    목표값: {isEditingKpi ? (
                      <input
                        type="number"
                        value={kpiTargets.spend}
                        onChange={(e) => handleKpiTargetChange('spend', e.target.value)}
                        style={{ width: '80px', padding: '2px 4px', fontSize: '12px' }}
                      />
                    ) : (
                      formatNumber(kpiTargets.spend)
                    )}원
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                  {formatNumber(todayData.totalSpend)}원
                </div>
                <div style={{ fontSize: '14px', color: '#28a745' }}>
                  달성률: {calculateAchievementRate(todayData.totalSpend, kpiTargets.spend)}%
                </div>
              </div>

              {/* 전환수 카드 */}
              <div style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>전환수</h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    목표값: {isEditingKpi ? (
                      <input
                        type="number"
                        value={kpiTargets.conversion}
                        onChange={(e) => handleKpiTargetChange('conversion', e.target.value)}
                        style={{ width: '80px', padding: '2px 4px', fontSize: '12px' }}
                      />
                    ) : (
                      formatNumber(kpiTargets.conversion)
                    )}건
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                  {formatNumber(todayData.conversion)}건
                </div>
                <div style={{ fontSize: '14px', color: '#28a745' }}>
                  달성률: {calculateAchievementRate(todayData.conversion, kpiTargets.conversion)}%
                </div>
              </div>

              {/* CPA 카드 */}
              <div style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>CPA</h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    목표값: {isEditingKpi ? (
                      <input
                        type="number"
                        value={kpiTargets.cpa}
                        onChange={(e) => handleKpiTargetChange('cpa', e.target.value)}
                        style={{ width: '80px', padding: '2px 4px', fontSize: '12px' }}
                      />
                    ) : (
                      formatNumber(kpiTargets.cpa)
                    )}원
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                  {formatNumber(Math.round(todayData.totalSpend / todayData.conversion))}원
                </div>
                <div style={{ fontSize: '14px', color: '#28a745' }}>
                  달성률: {calculateAchievementRate(kpiTargets.cpa, Math.round(todayData.totalSpend / todayData.conversion))}%
                </div>
              </div>

              {/* CVR 카드 */}
              <div style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>CVR</h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    목표값: {isEditingKpi ? (
                      <input
                        type="number"
                        value={kpiTargets.cvr}
                        onChange={(e) => handleKpiTargetChange('cvr', e.target.value)}
                        style={{ width: '80px', padding: '2px 4px', fontSize: '12px' }}
                      />
                    ) : (
                      kpiTargets.cvr
                    )}%
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                  {((todayData.conversion / todayData.totalClicks) * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '14px', color: '#28a745' }}>
                  달성률: {calculateAchievementRate(((todayData.conversion / todayData.totalClicks) * 100), kpiTargets.cvr)}%
                </div>
              </div>

              {/* 노출수 카드 */}
              <div style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>노출수</h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    목표값: {isEditingKpi ? (
                      <input
                        type="number"
                        value={kpiTargets.impressions}
                        onChange={(e) => handleKpiTargetChange('impressions', e.target.value)}
                        style={{ width: '80px', padding: '2px 4px', fontSize: '12px' }}
                      />
                    ) : (
                      formatNumber(kpiTargets.impressions)
                    )}회
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                  {formatNumber(todayData.totalImpressions)}회
                </div>
                <div style={{ fontSize: '14px', color: '#28a745' }}>
                  달성률: {calculateAchievementRate(todayData.totalImpressions, kpiTargets.impressions)}%
                </div>
              </div>

              {/* 클릭수 카드 */}
              <div style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>클릭수</h4>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    목표값: {isEditingKpi ? (
                      <input
                        type="number"
                        value={kpiTargets.clicks}
                        onChange={(e) => handleKpiTargetChange('clicks', e.target.value)}
                        style={{ width: '80px', padding: '2px 4px', fontSize: '12px' }}
                      />
                    ) : (
                      formatNumber(kpiTargets.clicks)
                    )}회
                  </span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
                  {formatNumber(todayData.totalClicks)}회
                </div>
                <div style={{ fontSize: '14px', color: '#28a745' }}>
                  달성률: {calculateAchievementRate(todayData.totalClicks, kpiTargets.clicks)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 