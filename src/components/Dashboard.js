import React from 'react';

const Dashboard = () => {
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

      <div className="data-card">
        <h3>매체별 성과</h3>
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
    </div>
  );
};

export default Dashboard; 