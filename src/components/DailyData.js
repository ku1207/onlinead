import React from 'react';

const DailyData = () => {
  
  const dailyData = [
    { date: '2024-01-15', spend: 1250000, clicks: 3420, impressions: 45600, cpc: 365, ctr: 7.5, conversion: 128 },
    { date: '2024-01-14', spend: 1180000, clicks: 3210, impressions: 42300, cpc: 368, ctr: 7.6, conversion: 115 },
    { date: '2024-01-13', spend: 1320000, clicks: 3650, impressions: 48200, cpc: 362, ctr: 7.6, conversion: 142 },
    { date: '2024-01-12', spend: 1095000, clicks: 2980, impressions: 39800, cpc: 367, ctr: 7.5, conversion: 108 },
    { date: '2024-01-11', spend: 1280000, clicks: 3540, impressions: 46900, cpc: 361, ctr: 7.5, conversion: 135 },
    { date: '2024-01-10', spend: 1150000, clicks: 3180, impressions: 42100, cpc: 362, ctr: 7.6, conversion: 119 },
    { date: '2024-01-09', spend: 1390000, clicks: 3820, impressions: 50200, cpc: 364, ctr: 7.6, conversion: 148 }
  ];

  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{ width: '85%', margin: '0 auto', padding: '20px 0' }}>
      <div className="content-header">
        <h1>일자별 데이터</h1>
      </div>

      <div className="data-card">
        <h3>일자별 성과 현황</h3>
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>날짜</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>광고비</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>클릭수</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>노출수</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>CPC</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>CTR</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>전환수</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((data, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                    {formatDate(data.date)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(data.spend)}원
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(data.clicks)}회
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(data.impressions)}회
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(data.cpc)}원
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {data.ctr}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(data.conversion)}건
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <h3>평균 지표</h3>
          <div className="metric">
            <span>일평균 광고비</span>
            <strong>{formatNumber(Math.round(dailyData.reduce((acc, data) => acc + data.spend, 0) / dailyData.length))}원</strong>
          </div>
          <div className="metric">
            <span>일평균 클릭수</span>
            <strong>{formatNumber(Math.round(dailyData.reduce((acc, data) => acc + data.clicks, 0) / dailyData.length))}회</strong>
          </div>
          <div className="metric">
            <span>일평균 노출수</span>
            <strong>{formatNumber(Math.round(dailyData.reduce((acc, data) => acc + data.impressions, 0) / dailyData.length))}회</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>주간 합계</h3>
          <div className="metric">
            <span>총 광고비</span>
            <strong>{formatNumber(dailyData.reduce((acc, data) => acc + data.spend, 0))}원</strong>
          </div>
          <div className="metric">
            <span>총 클릭수</span>
            <strong>{formatNumber(dailyData.reduce((acc, data) => acc + data.clicks, 0))}회</strong>
          </div>
          <div className="metric">
            <span>총 전환수</span>
            <strong>{formatNumber(dailyData.reduce((acc, data) => acc + data.conversion, 0))}건</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyData; 