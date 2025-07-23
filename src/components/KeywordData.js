import React, { useState, useEffect, useRef } from 'react';

const KeywordData = () => {
  const [filters, setFilters] = useState({
    platforms: ['네이버', '카카오', '구글', '메타', '틱톡'],
    date: '',
    metric: '광고비',
    sort: '내림차순',
    count: 20,
    minSpend: '',
    maxSpend: ''
  });
  
  const [displayColumns, setDisplayColumns] = useState({
    광고비: true,
    CPC: true,
    전환수: false,
    CPA: false,
    기타: false
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchCriteria, setSearchCriteria] = useState('');
  
  // 다운로드 관련 상태
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedDownloadItem, setSelectedDownloadItem] = useState('매체 합산 데이터');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // 전환 업로드 관련 상태
  const [showConversionUploadModal, setShowConversionUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // KPI 관련 상태
  const [showKpiExpanded, setShowKpiExpanded] = useState(false);
  const [selectedKpiMedia, setSelectedKpiMedia] = useState('전체'); // 전체를 기본값으로 변경
  const [kpiTargets, setKpiTargets] = useState({
    전체: {
      spend: 8300000, // 모든 매체 합계
      conversion: 420, // 모든 매체 합계
      cpa: 19762, // 전체 광고비 / 전체 전환수 (8300000 / 420)
      cvr: 3.1, // 전체 전환수 / 전체 클릭수 * 100 (420 / 27500 * 100)
      impressions: 1550000, // 모든 매체 합계
      clicks: 27500 // 모든 매체 합계
    },
    네이버: {
      spend: 3000000,
      conversion: 150,
      cpa: 15000,
      cvr: 3.5,
      impressions: 500000,
      clicks: 8000
    },
    카카오: {
      spend: 2000000,
      conversion: 100,
      cpa: 12000,
      cvr: 4.0,
      impressions: 300000,
      clicks: 5000
    },
    구글: {
      spend: 1500000,
      conversion: 80,
      cpa: 18000,
      cvr: 2.8,
      impressions: 400000,
      clicks: 6000
    },
    메타: {
      spend: 1000000,
      conversion: 50,
      cpa: 20000,
      cvr: 2.5,
      impressions: 200000,
      clicks: 3000
    },
    틱톡: {
      spend: 800000,
      conversion: 40,
      cpa: 20000,
      cvr: 3.0,
      impressions: 150000,
      clicks: 2500
    }
  });
  
  // 스크롤 동기화를 위한 ref들
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const expandedTopScrollRefs = useRef({});
  const expandedBottomScrollRefs = useRef({});
  
  // 다운로드 관련 함수들
  const handleDownloadItemChange = (value) => {
    setSelectedDownloadItem(value);
  };

  const handleDownloadConfirm = () => {
    // 다운로드 로직 (실제 구현 필요)
    
    // 모달 닫기
    setShowDownloadModal(false);
    setSelectedDownloadItem('매체 합산 데이터');
    
    // 성공 모달 표시
    setShowSuccessModal(true);
  };

  const handleDownloadCancel = () => {
    setShowDownloadModal(false);
    setSelectedDownloadItem('매체 합산 데이터');
  };
  
  // 전환 업로드 관련 함수들
  const handleConversionUpload = () => {
    setShowConversionUploadModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('CSV 파일만 업로드 가능합니다.');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv') {
        setSelectedFile(file);
      } else {
        alert('CSV 파일만 업로드 가능합니다.');
      }
    }
  };

  const handleUploadConfirm = () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    
    // 업로드 로직 (실제 구현 필요)
    console.log('업로드할 파일:', selectedFile);
    
    // 모달 닫기
    setShowConversionUploadModal(false);
    setSelectedFile(null);
    
    // 성공 모달 표시
    setShowUploadSuccessModal(true);
  };

  const handleUploadCancel = () => {
    setShowConversionUploadModal(false);
    setSelectedFile(null);
  };

  const handleTemplateDownload = () => {
    // 템플릿 다운로드 로직 (실제 구현 필요)
    console.log('전환 업로드 템플릿 다운로드');
    
    // 샘플 CSV 데이터 생성
    const sampleData = [
      ['매체', '키워드', '전환수', '전환비용', '전환율'],
      ['네이버', '온라인광고', '10', '50000', '2.5%'],
      ['구글', '디지털마케팅', '15', '45000', '3.0%'],
      ['카카오', 'SEM', '8', '40000', '2.0%']
    ];
    
    // CSV 문자열 생성
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    
    // 다운로드 실행
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '전환_업로드_템플릿.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // 스크롤 동기화 핸들러
  const handleTopScroll = () => {
    if (topScrollRef.current && bottomScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };
  
  const handleBottomScroll = () => {
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };
  
  // 확장된 테이블 스크롤 동기화 핸들러
  const handleExpandedTopScroll = (index) => {
    if (expandedTopScrollRefs.current[index] && expandedBottomScrollRefs.current[index]) {
      expandedBottomScrollRefs.current[index].scrollLeft = expandedTopScrollRefs.current[index].scrollLeft;
    }
  };
  
  const handleExpandedBottomScroll = (index) => {
    if (expandedTopScrollRefs.current[index] && expandedBottomScrollRefs.current[index]) {
      expandedTopScrollRefs.current[index].scrollLeft = expandedBottomScrollRefs.current[index].scrollLeft;
    }
  };

  // 랜덤 데이터 생성 함수
  const generateRandomData = () => {
    const platforms = ['네이버', '카카오', '구글', '메타', '틱톡'];
    const keywords = [
      '온라인광고', '디지털마케팅', 'SEM', '검색광고', '구글광고', 
      '네이버광고', '카카오광고', '메타광고', '광고대행사', '마케팅에이전시',
      '소셜미디어', '브랜드광고', '퍼포먼스', '리타겟팅', '콘텐츠마케팅',
      '데이터분석', '전환최적화', '타겟팅', '키워드분석', '광고운영'
    ];
    
    const campaigns = ['브랜드캠페인', '퍼포먼스캠페인', '리타겟팅캠페인', '신제품출시', '이벤트프로모션'];
    const adGroups = ['핵심키워드', '확장키워드', '브랜드키워드', '경쟁사키워드', '롱테일키워드'];
    
    const data = [];
    
    keywords.forEach(keyword => {
      platforms.forEach(platform => {
        // 기본 랜덤 값들
        const impressions = Math.floor(Math.random() * 50000) + 1000;
        const clicks = Math.floor(Math.random() * Math.min(impressions * 0.2, 5000)) + 10;
        const conversions = Math.floor(Math.random() * 100);
        
        // 각 기간별 광고비 생성
        const todaySpend = Math.floor(Math.random() * 500000);
        const yesterdaySpend = Math.floor(Math.random() * 500000);
        const last7daysSpend = Math.floor(Math.random() * 2000000);
        const prev7daysSpend = Math.floor(Math.random() * 2000000);
        const thisMonthSpend = Math.floor(Math.random() * 5000000);
        const lastMonthSpend = Math.floor(Math.random() * 5000000);
        
        // 각 기간별 클릭수 생성
        const todayClicks = Math.floor(Math.random() * 1000) + 1;
        const yesterdayClicks = Math.floor(Math.random() * 1000) + 1;
        const last7daysClicks = Math.floor(Math.random() * 5000) + 1;
        const prev7daysClicks = Math.floor(Math.random() * 5000) + 1;
        const thisMonthClicks = Math.floor(Math.random() * 15000) + 1;
        const lastMonthClicks = Math.floor(Math.random() * 15000) + 1;
        
        // 각 기간별 전환수 생성
        const todayConversions = Math.floor(Math.random() * 100);
        const yesterdayConversions = Math.floor(Math.random() * 100);
        const last7daysConversions = Math.floor(Math.random() * 100);
        const prev7daysConversions = Math.floor(Math.random() * 100);
        const thisMonthConversions = Math.floor(Math.random() * 100);
        const lastMonthConversions = Math.floor(Math.random() * 100);
        
        data.push({
          platform,
          keyword,
          // 광고비 데이터
          todaySpend,
          yesterdaySpend,
          last7daysSpend,
          prev7daysSpend,
          thisMonthSpend,
          lastMonthSpend,
          // CPC 데이터 (정수)
          todayCPC: todaySpend > 0 ? Math.floor(todaySpend / todayClicks) : 0,
          yesterdayCPC: yesterdaySpend > 0 ? Math.floor(yesterdaySpend / yesterdayClicks) : 0,
          last7daysCPC: last7daysSpend > 0 ? Math.floor(last7daysSpend / last7daysClicks) : 0,
          prev7daysCPC: prev7daysSpend > 0 ? Math.floor(prev7daysSpend / prev7daysClicks) : 0,
          thisMonthCPC: thisMonthSpend > 0 ? Math.floor(thisMonthSpend / thisMonthClicks) : 0,
          lastMonthCPC: lastMonthSpend > 0 ? Math.floor(lastMonthSpend / lastMonthClicks) : 0,
          // 전환수 데이터
          todayConversions,
          yesterdayConversions,
          last7daysConversions,
          prev7daysConversions,
          thisMonthConversions,
          lastMonthConversions,
          // CPA 데이터 (정수)
          todayCPA: todayConversions > 0 ? Math.floor(todaySpend / todayConversions) : 0,
          yesterdayCPA: yesterdayConversions > 0 ? Math.floor(yesterdaySpend / yesterdayConversions) : 0,
          last7daysCPA: last7daysConversions > 0 ? Math.floor(last7daysSpend / last7daysConversions) : 0,
          prev7daysCPA: prev7daysConversions > 0 ? Math.floor(prev7daysSpend / prev7daysConversions) : 0,
          thisMonthCPA: thisMonthConversions > 0 ? Math.floor(thisMonthSpend / thisMonthConversions) : 0,
          lastMonthCPA: lastMonthConversions > 0 ? Math.floor(lastMonthSpend / lastMonthConversions) : 0,
          // 기타 데이터
          cvr: clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0.0',
          campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
          adGroup: adGroups[Math.floor(Math.random() * adGroups.length)],
          impressions,
          clicks,
          ctr: impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0'
        });
      });
    });
    
    return data;
  };

  useEffect(() => {
    // 어제 날짜를 기본값으로 설정
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    setFilters(prev => ({
      ...prev,
      date: yesterdayString
    }));
    
    // 초기 로딩 시 데이터 표시
    const initialData = generateRandomData();
    // 기본 정렬: 기준일 광고비 내림차순
    const sortedData = [...initialData].sort((a, b) => b.todaySpend - a.todaySpend);
    setSearchResults(sortedData);
    setHasSearched(true);
    
    // 초기 검색 기준 텍스트 설정
    setSearchCriteria(`매체 - 모두 / 조회 일자 - ${yesterdayString} / 광고비 내림차순 상위 20개`);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  // KPI 관련 함수들
  const calculateAchievementRate = (current, target) => {
    return ((current / target) * 100).toFixed(1);
  };

  // 달성률 색상 결정 함수
  const getAchievementColor = (achievementRate) => {
    const rate = parseFloat(achievementRate);
    return rate >= 100 ? '#22c55e' : '#ef4444'; // 100% 이상이면 녹색, 미만이면 빨간색
  };



  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlatformChange = (platform) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSelectAllPlatforms = () => {
    const allPlatforms = ['네이버', '카카오', '구글', '메타', '틱톡'];
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms.length === allPlatforms.length ? [] : allPlatforms
    }));
  };

  const handleCountChange = (increment) => {
    setFilters(prev => ({
      ...prev,
      count: Math.max(1, prev.count + increment)
    }));
  };

  const handleDisplayColumnChange = (column) => {
    setDisplayColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleRowClick = (rowIndex) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  const handleSearch = () => {
    const newData = generateRandomData();
    let filteredData = [...newData];
    
    // 매체 필터
    if (filters.platforms.length > 0) {
      filteredData = filteredData.filter(item => filters.platforms.includes(item.platform));
    }
    
    // 광고비 범위 필터 (지표가 CPC일 때만)
    if (filters.metric === 'CPC' && (filters.minSpend || filters.maxSpend)) {
      filteredData = filteredData.filter(item => {
        const spend = item.todaySpend;
        const min = filters.minSpend ? parseInt(filters.minSpend) : 0;
        const max = filters.maxSpend ? parseInt(filters.maxSpend) : Infinity;
        return spend >= min && spend <= max;
      });
    }
    
    // 정렬
    const sortField = filters.metric === '광고비' ? 'todaySpend' : 
                     filters.metric === '클릭수' ? 'clicks' : 'todayCPC';
    const sortOrder = filters.sort === '내림차순' ? 'desc' : 'asc';
    
    filteredData.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] - b[sortField];
      } else {
        return b[sortField] - a[sortField];
      }
    });
    
    // 개수 제한
    filteredData = filteredData.slice(0, filters.count);
    
    // 검색 기준 텍스트 업데이트
    const platformText = filters.platforms.length === 5 ? '모두' : filters.platforms.join(', ');
    const sortText = filters.sort === '내림차순' ? '상위' : '하위';
    setSearchCriteria(`매체 - ${platformText} / 조회 일자 - ${filters.date} / ${filters.metric} ${filters.sort} ${sortText} ${filters.count}개`);
    
    setSearchResults(filteredData);
    setHasSearched(true);
    setCurrentPage(1);
    setExpandedRows({});
  };



  // 페이지네이션
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // 표시할 컬럼 결정
  const getVisibleColumns = () => {
    const baseColumns = ['매체', '키워드(소재)'];
    const additionalColumns = [];
    
    if (displayColumns.광고비) {
      additionalColumns.push('기준일(광고비)', '전일(광고비)', '최근 7일(광고비)', '이전 7일(광고비)', '기준월(광고비)', '전월(광고비)');
    }
    if (displayColumns.CPC) {
      additionalColumns.push('기준일(CPC)', '전일(CPC)', '최근 7일(CPC)', '이전 7일(CPC)', '기준월(CPC)', '전월(CPC)');
    }
    if (displayColumns.전환수) {
      additionalColumns.push('기준일(전환수)', '전일(전환수)', '최근 7일(전환수)', '이전 7일(전환수)', '기준월(전환수)', '전월(전환수)');
    }
    if (displayColumns.CPA) {
      additionalColumns.push('기준일(CPA)', '전일(CPA)', '최근 7일(CPA)', '이전 7일(CPA)', '기준월(CPA)', '전월(CPA)');
    }
    if (displayColumns.기타) {
      additionalColumns.push('CVR', '캠페인', '광고그룹', '노출수', '클릭수', 'CTR');
    }
    
    return [...baseColumns, ...additionalColumns];
  };

  // 구조화된 컬럼 정보 반환
  const getStructuredColumns = () => {
    const columns = [];
    
    // 기본 컬럼들
    columns.push({ 
      category: '기본', 
      name: '매체', 
      colspan: 1, 
      rowspan: 2, 
      color: '#f8f9fa' 
    });
    columns.push({ 
      category: '기본', 
      name: '키워드(소재)', 
      colspan: 1, 
      rowspan: 2, 
      color: '#f8f9fa' 
    });
    
    // 각 카테고리별 컬럼들
    const periodColumns = ['기준일', '전일', '최근 7일', '이전 7일', '기준월', '전월'];
    
    if (displayColumns.광고비) {
      columns.push({ 
        category: '광고비', 
        name: '광고비', 
        colspan: 6, 
        rowspan: 1, 
        color: '#e3f2fd', 
        subColumns: periodColumns 
      });
    }
    if (displayColumns.CPC) {
      columns.push({ 
        category: 'CPC', 
        name: 'CPC', 
        colspan: 6, 
        rowspan: 1, 
        color: '#f3e5f5', 
        subColumns: periodColumns 
      });
    }
    if (displayColumns.전환수) {
      columns.push({ 
        category: '전환수', 
        name: '전환수', 
        colspan: 6, 
        rowspan: 1, 
        color: '#e8f5e8', 
        subColumns: periodColumns 
      });
    }
    if (displayColumns.CPA) {
      columns.push({ 
        category: 'CPA', 
        name: 'CPA', 
        colspan: 6, 
        rowspan: 1, 
        color: '#fff3e0', 
        subColumns: periodColumns 
      });
    }
    if (displayColumns.기타) {
      const otherColumns = ['CVR', '캠페인', '광고그룹', '노출수', '클릭수', 'CTR'];
      columns.push({ 
        category: '기타', 
        name: '기타', 
        colspan: 6, 
        rowspan: 1, 
        color: '#fce4ec', 
        subColumns: otherColumns 
      });
    }
    
    return columns;
  };



  // 스크롤바 스타일 컴포넌트
  const ScrollbarStyle = () => (
    <style jsx>{`
      .table-scroll::-webkit-scrollbar {
        height: 12px;
      }
      .table-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .table-scroll::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      .table-scroll::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      .top-scroll::-webkit-scrollbar {
        height: 12px;
      }
      .top-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .top-scroll::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      .top-scroll::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `}</style>
  );

  // 기간별 합산 데이터 계산
  const getSummaryData = () => {
    if (searchResults.length === 0) return null;
    
    const summary = {
      todaySpend: 0,
      yesterdaySpend: 0,
      last7daysSpend: 0,
      prev7daysSpend: 0,
      thisMonthSpend: 0,
      lastMonthSpend: 0,
      todayConversions: 0,
      yesterdayConversions: 0,
      last7daysConversions: 0,
      prev7daysConversions: 0,
      thisMonthConversions: 0,
      lastMonthConversions: 0,
      todayImpressions: 0,
      yesterdayImpressions: 0,
      last7daysImpressions: 0,
      prev7daysImpressions: 0,
      thisMonthImpressions: 0,
      lastMonthImpressions: 0,
      todayClicks: 0,
      yesterdayClicks: 0,
      last7daysClicks: 0,
      prev7daysClicks: 0,
      thisMonthClicks: 0,
      lastMonthClicks: 0
    };
    
    // 검색 결과 데이터 합산
    searchResults.forEach(item => {
      summary.todaySpend += item.todaySpend;
      summary.yesterdaySpend += item.yesterdaySpend;
      summary.last7daysSpend += item.last7daysSpend;
      summary.prev7daysSpend += item.prev7daysSpend;
      summary.thisMonthSpend += item.thisMonthSpend;
      summary.lastMonthSpend += item.lastMonthSpend;
      
      summary.todayConversions += item.todayConversions;
      summary.yesterdayConversions += item.yesterdayConversions;
      summary.last7daysConversions += item.last7daysConversions;
      summary.prev7daysConversions += item.prev7daysConversions;
      summary.thisMonthConversions += item.thisMonthConversions;
      summary.lastMonthConversions += item.lastMonthConversions;
      
      summary.todayImpressions += item.impressions;
      summary.yesterdayImpressions += item.impressions;
      summary.last7daysImpressions += item.impressions * 7;
      summary.prev7daysImpressions += item.impressions * 7;
      summary.thisMonthImpressions += item.impressions * 30;
      summary.lastMonthImpressions += item.impressions * 30;
      
      summary.todayClicks += item.clicks;
      summary.yesterdayClicks += item.clicks;
      summary.last7daysClicks += item.clicks * 7;
      summary.prev7daysClicks += item.clicks * 7;
      summary.thisMonthClicks += item.clicks * 30;
      summary.lastMonthClicks += item.clicks * 30;
    });
    
    // 계산된 지표들
    const result = {
      // 광고비
      todaySpend: summary.todaySpend,
      yesterdaySpend: summary.yesterdaySpend,
      last7daysSpend: summary.last7daysSpend,
      prev7daysSpend: summary.prev7daysSpend,
      thisMonthSpend: summary.thisMonthSpend,
      lastMonthSpend: summary.lastMonthSpend,
      
      // CPC
      todayCPC: summary.todayClicks > 0 ? Math.floor(summary.todaySpend / summary.todayClicks) : 0,
      yesterdayCPC: summary.yesterdayClicks > 0 ? Math.floor(summary.yesterdaySpend / summary.yesterdayClicks) : 0,
      last7daysCPC: summary.last7daysClicks > 0 ? Math.floor(summary.last7daysSpend / summary.last7daysClicks) : 0,
      prev7daysCPC: summary.prev7daysClicks > 0 ? Math.floor(summary.prev7daysSpend / summary.prev7daysClicks) : 0,
      thisMonthCPC: summary.thisMonthClicks > 0 ? Math.floor(summary.thisMonthSpend / summary.thisMonthClicks) : 0,
      lastMonthCPC: summary.lastMonthClicks > 0 ? Math.floor(summary.lastMonthSpend / summary.lastMonthClicks) : 0,
      
      // 전환수
      todayConversions: summary.todayConversions,
      yesterdayConversions: summary.yesterdayConversions,
      last7daysConversions: summary.last7daysConversions,
      prev7daysConversions: summary.prev7daysConversions,
      thisMonthConversions: summary.thisMonthConversions,
      lastMonthConversions: summary.lastMonthConversions,
      
      // CPA
      todayCPA: summary.todayConversions > 0 ? Math.floor(summary.todaySpend / summary.todayConversions) : 0,
      yesterdayCPA: summary.yesterdayConversions > 0 ? Math.floor(summary.yesterdaySpend / summary.yesterdayConversions) : 0,
      last7daysCPA: summary.last7daysConversions > 0 ? Math.floor(summary.last7daysSpend / summary.last7daysConversions) : 0,
      prev7daysCPA: summary.prev7daysConversions > 0 ? Math.floor(summary.prev7daysSpend / summary.prev7daysConversions) : 0,
      thisMonthCPA: summary.thisMonthConversions > 0 ? Math.floor(summary.thisMonthSpend / summary.thisMonthConversions) : 0,
      lastMonthCPA: summary.lastMonthConversions > 0 ? Math.floor(summary.lastMonthSpend / summary.lastMonthConversions) : 0,
      
      // CVR
      todayCVR: summary.todayClicks > 0 ? ((summary.todayConversions / summary.todayClicks) * 100).toFixed(1) : '0.0',
      yesterdayCVR: summary.yesterdayClicks > 0 ? ((summary.yesterdayConversions / summary.yesterdayClicks) * 100).toFixed(1) : '0.0',
      last7daysCVR: summary.last7daysClicks > 0 ? ((summary.last7daysConversions / summary.last7daysClicks) * 100).toFixed(1) : '0.0',
      prev7daysCVR: summary.prev7daysClicks > 0 ? ((summary.prev7daysConversions / summary.prev7daysClicks) * 100).toFixed(1) : '0.0',
      thisMonthCVR: summary.thisMonthClicks > 0 ? ((summary.thisMonthConversions / summary.thisMonthClicks) * 100).toFixed(1) : '0.0',
      lastMonthCVR: summary.lastMonthClicks > 0 ? ((summary.lastMonthConversions / summary.lastMonthClicks) * 100).toFixed(1) : '0.0',
      
      // 노출수
      todayImpressions: summary.todayImpressions,
      yesterdayImpressions: summary.yesterdayImpressions,
      last7daysImpressions: summary.last7daysImpressions,
      prev7daysImpressions: summary.prev7daysImpressions,
      thisMonthImpressions: summary.thisMonthImpressions,
      lastMonthImpressions: summary.lastMonthImpressions,
      
      // 클릭수
      todayClicks: summary.todayClicks,
      yesterdayClicks: summary.yesterdayClicks,
      last7daysClicks: summary.last7daysClicks,
      prev7daysClicks: summary.prev7daysClicks,
      thisMonthClicks: summary.thisMonthClicks,
      lastMonthClicks: summary.lastMonthClicks,
      
      // CTR
      todayCTR: summary.todayImpressions > 0 ? ((summary.todayClicks / summary.todayImpressions) * 100).toFixed(1) : '0.0',
      yesterdayCTR: summary.yesterdayImpressions > 0 ? ((summary.yesterdayClicks / summary.yesterdayImpressions) * 100).toFixed(1) : '0.0',
      last7daysCTR: summary.last7daysImpressions > 0 ? ((summary.last7daysClicks / summary.last7daysImpressions) * 100).toFixed(1) : '0.0',
      prev7daysCTR: summary.prev7daysImpressions > 0 ? ((summary.prev7daysClicks / summary.prev7daysImpressions) * 100).toFixed(1) : '0.0',
      thisMonthCTR: summary.thisMonthImpressions > 0 ? ((summary.thisMonthClicks / summary.thisMonthImpressions) * 100).toFixed(1) : '0.0',
      lastMonthCTR: summary.lastMonthImpressions > 0 ? ((summary.lastMonthClicks / summary.lastMonthImpressions) * 100).toFixed(1) : '0.0'
    };
    
    return result;
  };
  
  // 등락률 계산
  const calculateChangeRate = (current, previous) => {
    if (previous === 0) return '-';
    const changeRate = (current / previous) - 1;
    return (changeRate * 100).toFixed(1);
  };
  
  // 등락률 색상 결정
  const getChangeColor = (rate, metric) => {
    if (rate === '-') return '#6b7280'; // 회색
    const numRate = parseFloat(rate);
    
    // 모든 지표에 대해 0% 초과면 초록색, 0% 미만이면 빨간색
    return numRate > 0 ? '#22c55e' : '#ef4444'; // 초록색 : 빨간색
  };
  
  // 등락률 표시
  const formatChangeRate = (rate, metric) => {
    if (rate === '-') {
      return (
        <span style={{ color: '#6b7280' }}>
          -
        </span>
      );
    }
    
    const numRate = parseFloat(rate);
    
    // 0%일 경우 "-"만 표시
    if (numRate === 0) {
      return (
        <span style={{ color: '#6b7280' }}>
          -
        </span>
      );
    }
    
    const symbol = numRate >= 0 ? '▲' : '▼';
    const color = getChangeColor(rate, metric);
    
    return (
      <span style={{ color }}>
        {symbol} {Math.abs(numRate)}%
      </span>
    );
  };

  // 전체 매체 합산 데이터 계산 함수
  const getAllMediaTotalData = () => {
    const summaryData = getSummaryData();
    if (!summaryData) return null;

    const platforms = ['네이버', '카카오', '구글', '메타', '틱톡'];
    let totalData = {
      spend: 0,
      conversion: 0,
      impressions: 0,
      clicks: 0
    };

    // 각 매체별 데이터를 합산
    platforms.forEach(platform => {
      if (kpiTargets[platform]) {
        // 각 매체별로 현재 달성 수치 계산 (랜덤 요소 적용)
        const mediaSpend = Math.floor(summaryData.thisMonthSpend * Math.random() * 0.5 + summaryData.thisMonthSpend * 0.25);
        const mediaConversion = Math.floor(summaryData.thisMonthConversion * Math.random() * 0.5 + summaryData.thisMonthConversion * 0.15);
        const mediaImpressions = Math.floor(summaryData.thisMonthImpressions * Math.random() * 0.5 + summaryData.thisMonthImpressions * 0.20);
        const mediaClicks = Math.floor(summaryData.thisMonthClicks * Math.random() * 0.5 + summaryData.thisMonthClicks * 0.18);
        
        totalData.spend += mediaSpend;
        totalData.conversion += mediaConversion;
        totalData.impressions += mediaImpressions;
        totalData.clicks += mediaClicks;
      }
    });

    // 계산된 지표들
    totalData.cpa = totalData.conversion > 0 ? Math.floor(totalData.spend / totalData.conversion) : 0;
    totalData.cvr = totalData.clicks > 0 ? ((totalData.conversion / totalData.clicks) * 100).toFixed(1) : '0.0';

    return totalData;
  };

  return (
    <div style={{ padding: '20px' }}>
      <ScrollbarStyle />
      
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>매체 합산 데이터</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="conversion-upload-button"
            onClick={handleConversionUpload}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#218838';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#28a745';
            }}
          >
            전환 업로드
          </button>
          <button 
            className="download-button"
            onClick={() => setShowDownloadModal(true)}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
            }}
          >
            다운로드
          </button>
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="data-card" style={{ marginBottom: '40px' }}>
        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-item">
              <label>매체 선택</label>
              <div className="platform-checkboxes-inline">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={filters.platforms.length === 5}
                    onChange={handleSelectAllPlatforms}
                  />
                  모두 선택
                </label>
                {['네이버', '카카오', '구글', '메타', '틱톡'].map((platform) => (
                  <label key={platform} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={filters.platforms.includes(platform)}
                      onChange={() => handlePlatformChange(platform)}
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="filter-item">
              <label>조회 일자</label>
              <input 
                type="date" 
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
            </div>
            
            <div className="filter-item">
              <label>지표</label>
              <select 
                value={filters.metric} 
                onChange={(e) => handleFilterChange('metric', e.target.value)}
              >
                <option value="광고비">광고비</option>
                <option value="클릭수">클릭수</option>
                <option value="CPC">CPC</option>
              </select>
              {filters.metric === 'CPC' && (
                <div className="sub-filter-item">
                  <label>광고비 범위</label>
                  <div className="range-input">
                    <input 
                      type="number" 
                      placeholder="최소"
                      value={filters.minSpend}
                      onChange={(e) => handleFilterChange('minSpend', e.target.value)}
                    />
                    <span>~</span>
                    <input 
                      type="number" 
                      placeholder="최대"
                      value={filters.maxSpend}
                      onChange={(e) => handleFilterChange('maxSpend', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="filter-item">
              <label>정렬</label>
              <select 
                value={filters.sort} 
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="내림차순">내림차순</option>
                <option value="오름차순">오름차순</option>
              </select>
            </div>
            
            <div className="filter-item">
              <label>개수</label>
              <div className="count-input">
                <button 
                  type="button" 
                  onClick={() => handleCountChange(-5)}
                  disabled={filters.count <= 5}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={filters.count}
                  onChange={(e) => handleFilterChange('count', Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  type="button" 
                  onClick={() => handleCountChange(5)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="filter-item-right">
              <button className="search-button" onClick={handleSearch}>
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 기간별 합산 데이터 */}
      {hasSearched && (
        <div className="data-card" style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>기간별 합산 데이터</h3>
            <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              <strong>검색 기준:</strong> {searchCriteria}
            </div>
          </div>
          
          {(() => {
            const summaryData = getSummaryData();
            if (!summaryData) return null;
            
            return (
              <div style={{ overflowX: 'auto', border: '1px solid #dee2e6', borderRadius: '5px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: '85px' }}>기간</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>광고비</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>CPC</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>전환수</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>CPA</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>CVR</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>노출수</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>클릭수</th>
                      <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', width: 'calc((100% - 85px) / 8)' }}>CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 전일 */}
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>전일</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.yesterdaySpend)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.yesterdayCPC)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.yesterdayConversions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.yesterdayCPA > 0 ? formatNumber(summaryData.yesterdayCPA) : '-'}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.yesterdayCVR}%</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.yesterdayImpressions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.yesterdayClicks)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.yesterdayCTR}%</td>
                    </tr>
                    
                    {/* 기준일 */}
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>기준일</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.todaySpend)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.todayCPC)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.todayConversions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.todayCPA > 0 ? formatNumber(summaryData.todayCPA) : '-'}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.todayCVR}%</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.todayImpressions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.todayClicks)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.todayCTR}%</td>
                    </tr>
                    
                    {/* 등락 (기준일/전일) */}
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>등락</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.todaySpend, summaryData.yesterdaySpend), '광고비')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.todayCPC, summaryData.yesterdayCPC), 'CPC')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.todayConversions, summaryData.yesterdayConversions), '전환수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.todayCPA, summaryData.yesterdayCPA), 'CPA')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(parseFloat(summaryData.todayCVR), parseFloat(summaryData.yesterdayCVR)), 'CVR')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.todayImpressions, summaryData.yesterdayImpressions), '노출수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.todayClicks, summaryData.yesterdayClicks), '클릭수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(parseFloat(summaryData.todayCTR), parseFloat(summaryData.yesterdayCTR)), 'CTR')}
                      </td>
                    </tr>
                    
                    {/* 이전 7일 */}
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>이전 7일</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.prev7daysSpend)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.prev7daysCPC)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.prev7daysConversions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.prev7daysCPA > 0 ? formatNumber(summaryData.prev7daysCPA) : '-'}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.prev7daysCVR}%</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.prev7daysImpressions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.prev7daysClicks)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.prev7daysCTR}%</td>
                    </tr>
                    
                    {/* 최근 7일 */}
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>최근 7일</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.last7daysSpend)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.last7daysCPC)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.last7daysConversions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.last7daysCPA > 0 ? formatNumber(summaryData.last7daysCPA) : '-'}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.last7daysCVR}%</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.last7daysImpressions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.last7daysClicks)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.last7daysCTR}%</td>
                    </tr>
                    
                    {/* 등락 (최근 7일/이전 7일) */}
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>등락</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.last7daysSpend, summaryData.prev7daysSpend), '광고비')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.last7daysCPC, summaryData.prev7daysCPC), 'CPC')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.last7daysConversions, summaryData.prev7daysConversions), '전환수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.last7daysCPA, summaryData.prev7daysCPA), 'CPA')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(parseFloat(summaryData.last7daysCVR), parseFloat(summaryData.prev7daysCVR)), 'CVR')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.last7daysImpressions, summaryData.prev7daysImpressions), '노출수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.last7daysClicks, summaryData.prev7daysClicks), '클릭수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(parseFloat(summaryData.last7daysCTR), parseFloat(summaryData.prev7daysCTR)), 'CTR')}
                      </td>
                    </tr>
                    
                    {/* 전월 */}
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>전월</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.lastMonthSpend)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.lastMonthCPC)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.lastMonthConversions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.lastMonthCPA > 0 ? formatNumber(summaryData.lastMonthCPA) : '-'}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.lastMonthCVR}%</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.lastMonthImpressions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.lastMonthClicks)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.lastMonthCTR}%</td>
                    </tr>
                    
                    {/* 기준월 */}
                    <tr>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>기준월</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.thisMonthSpend)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.thisMonthCPC)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.thisMonthConversions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.thisMonthCPA > 0 ? formatNumber(summaryData.thisMonthCPA) : '-'}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.thisMonthCVR}%</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.thisMonthImpressions)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{formatNumber(summaryData.thisMonthClicks)}</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>{summaryData.thisMonthCTR}%</td>
                    </tr>
                    
                    {/* 등락 (기준월/전월) */}
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>등락</td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.thisMonthSpend, summaryData.lastMonthSpend), '광고비')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.thisMonthCPC, summaryData.lastMonthCPC), 'CPC')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.thisMonthConversions, summaryData.lastMonthConversions), '전환수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.thisMonthCPA, summaryData.lastMonthCPA), 'CPA')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(parseFloat(summaryData.thisMonthCVR), parseFloat(summaryData.lastMonthCVR)), 'CVR')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.thisMonthImpressions, summaryData.lastMonthImpressions), '노출수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(summaryData.thisMonthClicks, summaryData.lastMonthClicks), '클릭수')}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        {formatChangeRate(calculateChangeRate(parseFloat(summaryData.thisMonthCTR), parseFloat(summaryData.lastMonthCTR)), 'CTR')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* 키워드(소재) 상세 데이터 */}
      {hasSearched && (
        <div className="data-card" style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <h3>키워드(소재) 상세 데이터</h3>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px', fontStyle: 'italic' }}>
                <strong>검색 기준:</strong> {searchCriteria}
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                키워드 행을 클릭하면 해당 키워드의 매체별 상세 데이터가 슬라이딩되어 표시됩니다.
              </div>
            </div>
          </div>

          {/* 표시할 데이터 선택 */}
          <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h4 style={{ marginBottom: '10px' }}>표시할 데이터 선택</h4>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {Object.entries(displayColumns).map(([column, checked]) => (
                <label key={column} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={() => handleDisplayColumnChange(column)}
                  />
                  {column}
                </label>
              ))}
            </div>
          </div>

          {/* 상단 스크롤바 */}
          <div 
            ref={topScrollRef}
            className="top-scroll"
            style={{ 
              overflowX: 'auto', 
              width: '100%',
              height: '20px',
              marginBottom: '5px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#888 #f1f1f1'
            }}
            onScroll={handleTopScroll}
          >
            <div style={{ width: `${getVisibleColumns().length * 150}px`, height: '1px' }}></div>
          </div>

          {/* 메인 테이블 */}
          <div 
            ref={bottomScrollRef}
            className="table-scroll"
            style={{ 
              overflowX: 'auto', 
              border: '1px solid #dee2e6', 
              borderRadius: '5px', 
              width: '100%',
              marginBottom: '20px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#888 #f1f1f1'
            }}
            onScroll={handleBottomScroll}
          >
            <table style={{ width: `${getVisibleColumns().length * 150}px`, minWidth: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                {/* 첫 번째 행: 카테고리 헤더 */}
                <tr>
                  {getStructuredColumns().map((column, index) => (
                    <th 
                      key={`category-${index}`} 
                      colSpan={column.colspan} 
                      rowSpan={column.rowspan}
                      style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6', 
                        fontSize: '12px', 
                        width: column.rowspan === 2 ? '150px' : `${column.colspan * 150}px`,
                        minWidth: column.rowspan === 2 ? '150px' : `${column.colspan * 150}px`,
                        backgroundColor: column.color,
                        fontWeight: 'bold',
                        ...(index === 0 ? { position: 'sticky', left: 0, zIndex: 10 } : {}),
                        ...(index === 1 ? { position: 'sticky', left: '150px', zIndex: 10 } : {})
                      }}
                    >
                      {column.name}
                    </th>
                  ))}
                </tr>
                {/* 두 번째 행: 세부 헤더 */}
                <tr>
                  {getStructuredColumns().map((column, index) => (
                    column.subColumns ? column.subColumns.map((subColumn, subIndex) => (
                      <th 
                        key={`sub-${index}-${subIndex}`}
                        style={{ 
                          padding: '12px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6', 
                          fontSize: '12px', 
                          width: '150px', 
                          minWidth: '150px',
                          backgroundColor: column.color,
                          fontWeight: 'normal',
                          ...(index === 0 ? { position: 'sticky', left: `${150 * subIndex}px`, zIndex: 10 } : {}),
                          ...(index === 1 ? { position: 'sticky', left: `${150 + (150 * subIndex)}px`, zIndex: 10 } : {})
                        }}
                      >
                        {subColumn}
                      </th>
                    )) : null
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((data, index) => (
                  <React.Fragment key={index}>
                    <tr 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRowClick(index)}
                    >
                      <td style={{ 
                        padding: '12px', 
                        border: '1px solid #dee2e6', 
                        textAlign: 'center', 
                        fontSize: '12px', 
                        width: '150px', 
                        minWidth: '150px',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#fff',
                        zIndex: 9
                      }}>
                        {data.platform}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        border: '1px solid #dee2e6', 
                        fontSize: '12px', 
                        width: '150px', 
                        minWidth: '150px',
                        position: 'sticky',
                        left: '150px',
                        backgroundColor: '#fff',
                        zIndex: 9
                      }}>
                        {data.keyword}
                      </td>
                      {displayColumns.광고비 && (
                        <>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.todaySpend)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.yesterdaySpend)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.last7daysSpend)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.prev7daysSpend)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.thisMonthSpend)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.lastMonthSpend)}
                          </td>
                        </>
                      )}
                      {displayColumns.CPC && (
                        <>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.todayCPC)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.yesterdayCPC)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.last7daysCPC)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.prev7daysCPC)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.thisMonthCPC)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.lastMonthCPC)}
                          </td>
                        </>
                      )}
                      {displayColumns.전환수 && (
                        <>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.todayConversions)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.yesterdayConversions)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.last7daysConversions)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.prev7daysConversions)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.thisMonthConversions)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.lastMonthConversions)}
                          </td>
                        </>
                      )}
                      {displayColumns.CPA && (
                        <>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.todayCPA > 0 ? formatNumber(data.todayCPA) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.yesterdayCPA > 0 ? formatNumber(data.yesterdayCPA) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.last7daysCPA > 0 ? formatNumber(data.last7daysCPA) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.prev7daysCPA > 0 ? formatNumber(data.prev7daysCPA) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.thisMonthCPA > 0 ? formatNumber(data.thisMonthCPA) : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.lastMonthCPA > 0 ? formatNumber(data.lastMonthCPA) : '-'}
                          </td>
                        </>
                      )}
                      {displayColumns.기타 && (
                        <>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.cvr}%
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.campaign}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.adGroup}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.impressions)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {formatNumber(data.clicks)}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6', fontSize: '12px', width: '150px', minWidth: '150px' }}>
                            {data.ctr}%
                          </td>
                        </>
                      )}
                    </tr>
                    
                    {/* 확장된 행 (클릭한 행에만 표시) */}
                    {expandedRows[index] && (
                      <tr>
                        <td colSpan={getVisibleColumns().length} style={{ padding: '0', border: '1px solid #dee2e6' }}>
                          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderTop: '2px solid #667eea' }}>
                            <h5 style={{ marginBottom: '10px', color: '#667eea' }}>'{data.keyword}' 키워드의 매체별 상세 데이터</h5>
                            
                            {/* 확장된 테이블 상단 스크롤바 */}
                            <div 
                              ref={el => expandedTopScrollRefs.current[index] = el}
                              className="top-scroll"
                              style={{ 
                                overflowX: 'auto', 
                                width: '100%',
                                height: '20px',
                                marginBottom: '5px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#888 #f1f1f1'
                              }}
                              onScroll={() => handleExpandedTopScroll(index)}
                            >
                              <div style={{ width: `${getVisibleColumns().length * 150}px`, height: '1px' }}></div>
                            </div>
                            
                            <div 
                              ref={el => expandedBottomScrollRefs.current[index] = el}
                              className="table-scroll"
                              style={{ 
                                overflowX: 'auto', 
                                width: '100%',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#888 #f1f1f1'
                              }}
                              onScroll={() => handleExpandedBottomScroll(index)}
                            >
                              <table style={{ width: `${getVisibleColumns().length * 150}px`, minWidth: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                  {/* 첫 번째 행: 카테고리 헤더 */}
                                  <tr>
                                    {getStructuredColumns().map((column, columnIndex) => (
                                      <th 
                                        key={`expanded-category-${columnIndex}`} 
                                        colSpan={column.colspan} 
                                        rowSpan={column.rowspan}
                                        style={{ 
                                          padding: '8px', 
                                          textAlign: 'center', 
                                          border: '1px solid #adb5bd', 
                                          fontSize: '11px', 
                                          width: column.rowspan === 2 ? '150px' : `${column.colspan * 150}px`,
                                          minWidth: column.rowspan === 2 ? '150px' : `${column.colspan * 150}px`,
                                          backgroundColor: column.color,
                                          fontWeight: 'bold',
                                          ...(columnIndex === 0 ? { position: 'sticky', left: 0, zIndex: 10 } : {}),
                                          ...(columnIndex === 1 ? { position: 'sticky', left: '150px', zIndex: 10 } : {})
                                        }}
                                      >
                                        {column.name}
                                      </th>
                                    ))}
                                  </tr>
                                  {/* 두 번째 행: 세부 헤더 */}
                                  <tr>
                                    {getStructuredColumns().map((column, columnIndex) => (
                                      column.subColumns ? column.subColumns.map((subColumn, subIndex) => (
                                        <th 
                                          key={`expanded-sub-${columnIndex}-${subIndex}`}
                                          style={{ 
                                            padding: '8px', 
                                            textAlign: 'center', 
                                            border: '1px solid #adb5bd', 
                                            fontSize: '11px', 
                                            width: '150px', 
                                            minWidth: '150px',
                                            backgroundColor: column.color,
                                            fontWeight: 'normal',
                                            ...(columnIndex === 0 ? { position: 'sticky', left: `${150 * subIndex}px`, zIndex: 10 } : {}),
                                            ...(columnIndex === 1 ? { position: 'sticky', left: `${150 + (150 * subIndex)}px`, zIndex: 10 } : {})
                                          }}
                                        >
                                          {subColumn}
                                        </th>
                                      )) : null
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {searchResults
                                    .filter(item => item.keyword === data.keyword)
                                    .map((item, subIndex) => (
                                    <tr key={subIndex}>
                                      <td style={{ 
                                        padding: '8px', 
                                        border: '1px solid #adb5bd', 
                                        textAlign: 'center', 
                                        fontSize: '11px', 
                                        width: '150px', 
                                        minWidth: '150px',
                                        position: 'sticky',
                                        left: 0,
                                        backgroundColor: '#f8f9fa',
                                        zIndex: 9
                                      }}>
                                        {item.platform}
                                      </td>
                                      <td style={{ 
                                        padding: '8px', 
                                        border: '1px solid #adb5bd', 
                                        fontSize: '11px', 
                                        width: '150px', 
                                        minWidth: '150px',
                                        position: 'sticky',
                                        left: '150px',
                                        backgroundColor: '#f8f9fa',
                                        zIndex: 9
                                      }}>
                                        {item.keyword}
                                      </td>
                                      {displayColumns.광고비 && (
                                        <>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.todaySpend)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.yesterdaySpend)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.last7daysSpend)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.prev7daysSpend)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.thisMonthSpend)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.lastMonthSpend)}
                                          </td>
                                        </>
                                      )}
                                      {displayColumns.CPC && (
                                        <>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.todayCPC)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.yesterdayCPC)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.last7daysCPC)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.prev7daysCPC)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.thisMonthCPC)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.lastMonthCPC)}
                                          </td>
                                        </>
                                      )}
                                      {displayColumns.전환수 && (
                                        <>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.todayConversions)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.yesterdayConversions)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.last7daysConversions)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.prev7daysConversions)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.thisMonthConversions)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.lastMonthConversions)}
                                          </td>
                                        </>
                                      )}
                                      {displayColumns.CPA && (
                                        <>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.todayCPA > 0 ? formatNumber(item.todayCPA) : '-'}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.yesterdayCPA > 0 ? formatNumber(item.yesterdayCPA) : '-'}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.last7daysCPA > 0 ? formatNumber(item.last7daysCPA) : '-'}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.prev7daysCPA > 0 ? formatNumber(item.prev7daysCPA) : '-'}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.thisMonthCPA > 0 ? formatNumber(item.thisMonthCPA) : '-'}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.lastMonthCPA > 0 ? formatNumber(item.lastMonthCPA) : '-'}
                                          </td>
                                        </>
                                      )}
                                      {displayColumns.기타 && (
                                        <>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.cvr}%
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.campaign}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.adGroup}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.impressions)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {formatNumber(item.clicks)}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #adb5bd', fontSize: '11px', width: '150px', minWidth: '150px' }}>
                                            {item.ctr}%
                                          </td>
                                        </>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 컨트롤 */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
            <div style={{ marginRight: '20px' }}>
              <label style={{ marginRight: '10px' }}>행 수:</label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <div>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ 
                  padding: '5px 10px', 
                  marginRight: '5px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                이전
              </button>
              
              <span style={{ margin: '0 10px' }}>
                {currentPage} / {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ 
                  padding: '5px 10px', 
                  marginLeft: '5px', 
                  borderRadius: '4px', 
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                다음
              </button>
            </div>
          </div>

          {/* 표시 개수 텍스트 */}
          <div style={{ 
            marginTop: '15px', 
            fontSize: '14px', 
            color: '#666',
            textAlign: 'center'
          }}>
            총 {searchResults.length}개 중 {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, searchResults.length)}개 표시
          </div>
        </div>
      )}

      {/* 다운로드 모달 */}
      {showDownloadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>다운로드</h3>
            <div className="modal-content">
              <div className="form-group">
                <select
                  value={selectedDownloadItem}
                  onChange={(e) => handleDownloadItemChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="매체 합산 데이터">매체 합산 데이터</option>
                  <option value="RAW 데이터">RAW 데이터</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleDownloadCancel}
              >
                취소
              </button>
              <button 
                className="save-button"
                onClick={handleDownloadConfirm}
              >
                다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 전환 업로드 모달 */}
      {showConversionUploadModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>전환 업로드</h3>
            <div className="modal-content">
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  CSV 파일 업로드
                </label>
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    border: dragActive ? '2px dashed #007bff' : '2px dashed #ddd',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    cursor: 'pointer',
                    backgroundColor: dragActive ? '#f8f9ff' : '#fafafa',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                    <div style={{ fontSize: '24px', color: '#007bff', marginBottom: '10px' }}>
                      📁
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                      {selectedFile ? selectedFile.name : '파일을 선택하거나 여기에 드래그하세요'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {selectedFile ? `크기: ${(selectedFile.size / 1024).toFixed(2)} KB` : 'CSV 파일만 업로드 가능합니다'}
                    </div>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ textAlign: 'right' }}>
                <button 
                  className="template-download-button"
                  onClick={handleTemplateDownload}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    width: 'auto',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0056b3';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                  }}
                >
                  템플릿 다운로드
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={handleUploadCancel}
              >
                취소
              </button>
              <button 
                className="save-button"
                onClick={handleUploadConfirm}
              >
                업로드
              </button>
            </div>
          </div>
        </div>
      )}

      <>
        {/* 플로팅 KPI 확장 영역 */}
        <div 
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}
        >
          {showKpiExpanded ? (
            // 확장된 KPI 카드들
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '25px',
              width: '450px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              animation: 'expandFromButton 0.3s ease-out',
              transformOrigin: 'bottom right'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#000000', fontSize: '18px' }}>KPI 달성률</h3>
                <button
                  onClick={() => setShowKpiExpanded(false)}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: 'transparent',
                    color: '#dc3545',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>

              {/* 매체별 탭 네비게이션 */}
              <div style={{ 
                marginBottom: '20px', 
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                overflowX: 'auto',
                gap: '5px'
              }}>
                {/* 전체 탭 */}
                <button
                  onClick={() => setSelectedKpiMedia('전체')}
                  style={{
                    background: selectedKpiMedia === '전체' ? '#007bff' : 'transparent',
                    color: selectedKpiMedia === '전체' ? 'white' : '#666',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: selectedKpiMedia === '전체' ? '600' : '400',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content'
                  }}
                >
                  전체
                </button>
                {/* 매체별 탭들 */}
                {filters.platforms.map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedKpiMedia(platform)}
                    style={{
                      background: selectedKpiMedia === platform ? '#007bff' : 'transparent',
                      color: selectedKpiMedia === platform ? 'white' : '#666',
                      border: 'none',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: selectedKpiMedia === platform ? '600' : '400',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content'
                    }}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {getSummaryData() && kpiTargets[selectedKpiMedia] && (() => {
                const summaryData = getSummaryData();
                const mediaKpiTargets = kpiTargets[selectedKpiMedia];
                const isTotal = selectedKpiMedia === '전체';
                const totalData = isTotal ? getAllMediaTotalData() : null;

                return (
                  <div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {/* 광고비 카드 */}
                      <div style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '10px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>광고비</h4>
                          <span style={{ fontSize: '10px', color: '#6c757d' }}>
                            목표값: {formatNumber(mediaKpiTargets.spend)}원
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '6px' }}>
                          {isTotal && totalData ? 
                            formatNumber(totalData.spend) : 
                            formatNumber(Math.floor(summaryData.thisMonthSpend * Math.random() * 0.5 + summaryData.thisMonthSpend * 0.25))
                          }원
                        </div>
                        <div style={{ fontSize: '11px', color: getAchievementColor(calculateAchievementRate(isTotal && totalData ? totalData.spend : Math.floor(summaryData.thisMonthSpend * Math.random() * 0.5 + summaryData.thisMonthSpend * 0.25), mediaKpiTargets.spend)) }}>
                          달성률: {calculateAchievementRate(isTotal && totalData ? totalData.spend : Math.floor(summaryData.thisMonthSpend * Math.random() * 0.5 + summaryData.thisMonthSpend * 0.25), mediaKpiTargets.spend)}%
                        </div>
                      </div>

                      {/* 전환수 카드 */}
                      <div style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '10px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>전환수</h4>
                          <span style={{ fontSize: '10px', color: '#6c757d' }}>
                            목표값: {formatNumber(mediaKpiTargets.conversion)}건
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '6px' }}>
                          {isTotal && totalData ? 
                            formatNumber(totalData.conversion) : 
                            formatNumber(Math.floor(summaryData.thisMonthConversion * Math.random() * 0.5 + summaryData.thisMonthConversion * 0.15))
                          }건
                        </div>
                        <div style={{ fontSize: '11px', color: getAchievementColor(calculateAchievementRate(isTotal && totalData ? totalData.conversion : Math.floor(summaryData.thisMonthConversion * Math.random() * 0.5 + summaryData.thisMonthConversion * 0.15), mediaKpiTargets.conversion)) }}>
                          달성률: {calculateAchievementRate(isTotal && totalData ? totalData.conversion : Math.floor(summaryData.thisMonthConversion * Math.random() * 0.5 + summaryData.thisMonthConversion * 0.15), mediaKpiTargets.conversion)}%
                        </div>
                      </div>

                      {/* CPA 카드 */}
                      <div style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '10px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>CPA</h4>
                          <span style={{ fontSize: '10px', color: '#6c757d' }}>
                            목표값: {formatNumber(mediaKpiTargets.cpa)}원
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '6px' }}>
                          {isTotal && totalData ? 
                            formatNumber(totalData.cpa) : 
                            formatNumber(summaryData.thisMonthCPA)
                          }원
                        </div>
                        <div style={{ fontSize: '11px', color: getAchievementColor(calculateAchievementRate(mediaKpiTargets.cpa, isTotal && totalData ? totalData.cpa : summaryData.thisMonthCPA)) }}>
                          달성률: {calculateAchievementRate(mediaKpiTargets.cpa, isTotal && totalData ? totalData.cpa : summaryData.thisMonthCPA)}%
                        </div>
                      </div>

                      {/* CVR 카드 */}
                      <div style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '10px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>CVR</h4>
                          <span style={{ fontSize: '10px', color: '#6c757d' }}>
                            목표값: {mediaKpiTargets.cvr.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '6px' }}>
                          {isTotal && totalData ? 
                            parseFloat(totalData.cvr).toFixed(1) : 
                            parseFloat(summaryData.thisMonthCVR).toFixed(1)
                          }%
                        </div>
                        <div style={{ fontSize: '11px', color: getAchievementColor(calculateAchievementRate(isTotal && totalData ? parseFloat(totalData.cvr) : parseFloat(summaryData.thisMonthCVR), mediaKpiTargets.cvr)) }}>
                          달성률: {calculateAchievementRate(isTotal && totalData ? parseFloat(totalData.cvr) : parseFloat(summaryData.thisMonthCVR), mediaKpiTargets.cvr)}%
                        </div>
                      </div>

                      {/* 노출수 카드 */}
                      <div style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '10px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>노출수</h4>
                          <span style={{ fontSize: '10px', color: '#6c757d' }}>
                            목표값: {formatNumber(mediaKpiTargets.impressions)}회
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '6px' }}>
                          {isTotal && totalData ? 
                            formatNumber(totalData.impressions) : 
                            formatNumber(Math.floor(summaryData.thisMonthImpressions * Math.random() * 0.5 + summaryData.thisMonthImpressions * 0.20))
                          }회
                        </div>
                        <div style={{ fontSize: '11px', color: getAchievementColor(calculateAchievementRate(isTotal && totalData ? totalData.impressions : Math.floor(summaryData.thisMonthImpressions * Math.random() * 0.5 + summaryData.thisMonthImpressions * 0.20), mediaKpiTargets.impressions)) }}>
                          달성률: {calculateAchievementRate(isTotal && totalData ? totalData.impressions : Math.floor(summaryData.thisMonthImpressions * Math.random() * 0.5 + summaryData.thisMonthImpressions * 0.20), mediaKpiTargets.impressions)}%
                        </div>
                      </div>

                      {/* 클릭수 카드 */}
                      <div style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '10px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>클릭수</h4>
                          <span style={{ fontSize: '10px', color: '#6c757d' }}>
                            목표값: {formatNumber(mediaKpiTargets.clicks)}회
                          </span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#007bff', marginBottom: '6px' }}>
                          {isTotal && totalData ? 
                            formatNumber(totalData.clicks) : 
                            formatNumber(Math.floor(summaryData.thisMonthClicks * Math.random() * 0.5 + summaryData.thisMonthClicks * 0.18))
                          }회
                        </div>
                        <div style={{ fontSize: '11px', color: getAchievementColor(calculateAchievementRate(isTotal && totalData ? totalData.clicks : Math.floor(summaryData.thisMonthClicks * Math.random() * 0.5 + summaryData.thisMonthClicks * 0.18), mediaKpiTargets.clicks)) }}>
                          달성률: {calculateAchievementRate(isTotal && totalData ? totalData.clicks : Math.floor(summaryData.thisMonthClicks * Math.random() * 0.5 + summaryData.thisMonthClicks * 0.18), mediaKpiTargets.clicks)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            // 기본 플로팅 버튼
            <button 
              onClick={() => setShowKpiExpanded(true)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '15px 25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0056b3';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
              }}
            >
              KPI 확인
            </button>
          )}
        </div>
      </>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>다운로드 완료</h3>
            <div className="modal-content">
              <p>다운로드가 완료되었습니다.</p>
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

      {/* 업로드 성공 모달 */}
      {showUploadSuccessModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>업로드 완료</h3>
            <div className="modal-content">
              <p>전환 데이터 업로드가 완료되었습니다.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="save-button"
                onClick={() => setShowUploadSuccessModal(false)}
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

export default KeywordData; 