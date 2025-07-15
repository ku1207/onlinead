import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const MediaData = () => {
  const { platform } = useParams();
  const [selectedPlatform, setSelectedPlatform] = useState(platform || 'naver');
  
  const platformData = {
    naver: {
      name: '네이버',
      totalSpend: 450000,
      totalClicks: 1200,
      totalImpressions: 15000,
      campaigns: [
        { name: '브랜드 캠페인', spend: 180000, clicks: 480, impressions: 6000, cpc: 375, ctr: 8.0 },
        { name: '상품 홍보', spend: 150000, clicks: 400, impressions: 5000, cpc: 375, ctr: 8.0 },
        { name: '이벤트 광고', spend: 120000, clicks: 320, impressions: 4000, cpc: 375, ctr: 8.0 }
      ]
    },
    google: {
      name: '구글',
      totalSpend: 380000,
      totalClicks: 950,
      totalImpressions: 12000,
      campaigns: [
        { name: '검색 광고', spend: 200000, clicks: 500, impressions: 6000, cpc: 400, ctr: 8.3 },
        { name: '디스플레이 광고', spend: 120000, clicks: 300, impressions: 4000, cpc: 400, ctr: 7.5 },
        { name: '쇼핑 광고', spend: 60000, clicks: 150, impressions: 2000, cpc: 400, ctr: 7.5 }
      ]
    },
    kakao: {
      name: '카카오',
      totalSpend: 320000,
      totalClicks: 890,
      totalImpressions: 11000,
      campaigns: [
        { name: '카카오톡 광고', spend: 180000, clicks: 500, impressions: 6000, cpc: 360, ctr: 8.3 },
        { name: '카카오스토리 광고', spend: 90000, clicks: 250, impressions: 3000, cpc: 360, ctr: 8.3 },
        { name: '다음 검색 광고', spend: 50000, clicks: 140, impressions: 2000, cpc: 357, ctr: 7.0 }
      ]
    },
    facebook: {
      name: '페이스북',
      totalSpend: 70000,
      totalClicks: 250,
      totalImpressions: 4200,
      campaigns: [
        { name: '페이스북 피드', spend: 35000, clicks: 125, impressions: 2100, cpc: 280, ctr: 6.0 },
        { name: '인스타그램 스토리', spend: 25000, clicks: 90, impressions: 1500, cpc: 278, ctr: 6.0 },
        { name: '메신저 광고', spend: 10000, clicks: 35, impressions: 600, cpc: 286, ctr: 5.8 }
      ]
    },
    tiktok: {
      name: '틱톡',
      totalSpend: 30000,
      totalClicks: 130,
      totalImpressions: 3400,
      campaigns: [
        { name: '틱톡 피드', spend: 20000, clicks: 87, impressions: 2200, cpc: 230, ctr: 4.0 },
        { name: '틱톡 스파크', spend: 10000, clicks: 43, impressions: 1200, cpc: 233, ctr: 3.6 }
      ]
    }
  };

  const platforms = [
    { id: 'naver', name: '네이버' },
    { id: 'google', name: '구글' },
    { id: 'kakao', name: '카카오' },
    { id: 'facebook', name: '페이스북' },
    { id: 'tiktok', name: '틱톡' }
  ];

  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  const currentData = platformData[selectedPlatform];

  return (
    <div style={{ width: '85%', margin: '0 auto', padding: '20px 0' }}>
      <div className="content-header">
        <h1>매체별 데이터</h1>
      </div>

      <div className="platform-selector">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            className={selectedPlatform === platform.id ? 'active' : ''}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            {platform.name}
          </button>
        ))}
      </div>

      <div className="data-grid">
        <div className="data-card">
          <h3>{currentData.name} 총 성과</h3>
          <div className="metric">
            <span>총 광고비</span>
            <strong>{formatNumber(currentData.totalSpend)}원</strong>
          </div>
          <div className="metric">
            <span>총 클릭수</span>
            <strong>{formatNumber(currentData.totalClicks)}회</strong>
          </div>
          <div className="metric">
            <span>총 노출수</span>
            <strong>{formatNumber(currentData.totalImpressions)}회</strong>
          </div>
        </div>

        <div className="data-card">
          <h3>평균 지표</h3>
          <div className="metric">
            <span>평균 CPC</span>
            <strong>{formatNumber(Math.round(currentData.totalSpend / currentData.totalClicks))}원</strong>
          </div>
          <div className="metric">
            <span>평균 CTR</span>
            <strong>{((currentData.totalClicks / currentData.totalImpressions) * 100).toFixed(1)}%</strong>
          </div>
          <div className="metric">
            <span>캠페인 수</span>
            <strong>{currentData.campaigns.length}개</strong>
          </div>
        </div>
      </div>

      <div className="data-card">
        <h3>{currentData.name} 캠페인별 성과</h3>
        <div style={{ marginTop: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>캠페인명</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>광고비</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>클릭수</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>노출수</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>CPC</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>CTR</th>
              </tr>
            </thead>
            <tbody>
              {currentData.campaigns.map((campaign, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>
                    {campaign.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(campaign.spend)}원
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(campaign.clicks)}회
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(campaign.impressions)}회
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {formatNumber(campaign.cpc)}원
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                    {campaign.ctr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="data-grid">
        <div className="data-card">
          <h3>최고 성과 캠페인</h3>
          {(() => {
            const bestCampaign = currentData.campaigns.reduce((best, campaign) => 
              campaign.clicks > best.clicks ? campaign : best
            );
            return (
              <div>
                <div className="metric">
                  <span>캠페인명</span>
                  <strong>{bestCampaign.name}</strong>
                </div>
                <div className="metric">
                  <span>클릭수</span>
                  <strong>{formatNumber(bestCampaign.clicks)}회</strong>
                </div>
                <div className="metric">
                  <span>광고비</span>
                  <strong>{formatNumber(bestCampaign.spend)}원</strong>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="data-card">
          <h3>효율성 분석</h3>
          {(() => {
            const mostEfficient = currentData.campaigns.reduce((best, campaign) => 
              campaign.cpc < best.cpc ? campaign : best
            );
            return (
              <div>
                <div className="metric">
                  <span>최고 효율 캠페인</span>
                  <strong>{mostEfficient.name}</strong>
                </div>
                <div className="metric">
                  <span>CPC</span>
                  <strong>{formatNumber(mostEfficient.cpc)}원</strong>
                </div>
                <div className="metric">
                  <span>CTR</span>
                  <strong>{mostEfficient.ctr}%</strong>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default MediaData; 