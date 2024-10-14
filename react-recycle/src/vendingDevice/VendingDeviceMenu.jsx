import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-modal';
import m from '../styles/VendingDeviceMenu.module.css';

Modal.setAppElement('#root');
const VendingDeviceMenu = React.memo(({ locations, onLocationClick, searchHistory, setSearchHistory, loading }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState("nephron");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [dontShowToday, setDontShowToday] = useState(false);
  const POPUP_KEY = `dontShowPopup_${activeButton}`;
  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const listRef = useRef(null);



  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery !== '' && !searchHistory.includes(trimmedQuery)) {
        const newHistory = [...searchHistory, trimmedQuery].slice(-5);
        setSearchHistory(newHistory);
        setSearchQuery('');
      }
    }
  }, [searchQuery, searchHistory, setSearchHistory]);

  const handleSearchClick = useCallback((index) => {
    const newHistory = searchHistory.filter((_, idx) => idx !== index); setSearchHistory(newHistory);
  }, [searchHistory, setSearchHistory]);

  const totalVendingMachinces = useMemo(() => {
    return locations.reduce((total, loc) => total + loc.vendingDevices.length, 0);
  }, [locations]);

  const clearSearch = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  const handleDontShowTodayChange = useCallback(() => {
    const newDontShow = !dontShowToday;
    const expirationTime = newDontShow ? new Date().getTime() + 24 * 60 * 60 * 1000 : '';
    setDontShowToday(newDontShow);
    localStorage.setItem(POPUP_KEY, expirationTime);

    if (newDontShow) {
      setIsModalOpen(false); // 체크박스 선택 시 모달 닫기
    }
  }, [dontShowToday, POPUP_KEY]);
  const nephron_Summation = (
    <>
      네프론은 슈퍼빈의 순환자원 회수 로봇으로, 재활용 자판기라고도 불립니다. 이 로봇은 기체마다 처리할 수 있는 재활용품의 종류가 다르며, 현재는 페트병과 캔에 대해서만 처리하고 있습니다. <br /><br />
      사용자가 지정된 재활용품을 깨끗하게 처리하여 투입하면, 로봇에 내장된 AI의 딥러닝 기술을 통해 투입된 쓰레기를 식별합니다. 사용자는 이를 통해 1포인트당 1원으로 환전할 수 있는 포인트를 적립할 수 있으며, 적립된 포인트는 수퍼빈 홈페이지 또는 모바일 앱의 적립 내역 메뉴에서 확인할 수 있습니다. <br /><br />
      네프론은 재활용 효율을 높이고, 환경 보호에 기여하는 혁신적인 솔루션입니다. 더 자세한 사항이나 궁금한 점이 있다면, 수퍼빈의 공식 사이트를 방문하거나 고객 지원 센터에 문의해 주시기 바랍니다.
    </>

  );
  const handleLocationClick = useCallback((loc) => {
    onLocationClick(loc);
  }, [onLocationClick])
  const handleTabClick = useCallback((tab) => {
    setActiveButton(tab);
    setDontShowToday(false);

    if (tab === "nephron") {
      setModalContent({
        title: "네프론 설명",
        content: nephron_Summation,
      });
    }
    setIsModalOpen(true);
  }, []);
  useEffect(() => {
    if (isModalOpen) {
      setIsOpen(false); // 모달이 열릴 때 메뉴를 닫음
    } else {
      setIsOpen(true); // 모달이 닫힐 때 메뉴를 다시 엶
    }
  }, [isModalOpen]);
  useEffect(() => {
    const expirationTime = localStorage.getItem(POPUP_KEY);
    const currentTime = new Date().getTime();

    if (expirationTime && currentTime < expirationTime) {
      setDontShowToday(true);
    } else {
      localStorage.removeItem(POPUP_KEY);
      // 모달 열기 조건
      if (!dontShowToday) {
        setModalContent({
          title: "네프론 설명",
          content: nephron_Summation,
        });
        setIsModalOpen(true);
      }
    }
  }, [dontShowToday, POPUP_KEY]);



  useEffect(() => { // 표시되는 리스트가 바뀌면 스크롤을 초기화 하는 함수 (09-23-09:27)
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [locations]);
  return (
    <div>
      <div className={`${m.sideMenu} ${isOpen ? m.open : ''}`}>
        <div className={m.search}>
          <input type="text" placeholder="자판기 위치 검색" onChange={handleSearchChange} value={searchQuery} onKeyDown={handleKeyPress} />
          <div className={m.searchBar}>
            <p>검색된 자판기: {totalVendingMachinces}대</p>
            <button className={m.clearButton} onClick={clearSearch}>
              검색 초기화
            </button>
          </div>
          {searchHistory.length > 0 && (
            <div className={m.searchHistoryContainer}>
              {searchHistory.map((query, index) => (
                <p key={index} className={m.searchHistoryItem} onClick={() => handleSearchClick(index)}>{query}</p>
              ))}
            </div>
          )}
        </div>
        <div ref={listRef} className={`${m.KakaoMapList} ${isOpen ? m.open : ''} ${searchHistory.length > 0 ? m.withSearchHistory : ''} ${loading ? m.loading : ''} `}>
          {loading ? (
            <div className={m.VendingDeviceLoading}>
              <img src="/img/VendingLoading.gif" alt="Loading..." />
              <h4>Loading...</h4>
            </div>
          ) : (
            locations.filter(loc => loc.isMatch) // 조건에 맞는 항목만 필터링 (09-23-09:15)
              .map((loc, locIdx) => (
                loc.vendingDevices.map((device, deviceIdx) => (
                  <div key={`${locIdx}-${deviceIdx}`} className={m.locationItem} onClick={() => handleLocationClick(loc)}>
                    <h4>{loc.vendingDevices.length === 1 ? loc.name : `${loc.name} ${deviceIdx + 1}`}</h4>
                    <p>{loc.address}</p>
                    <p>{device.recycleType}</p>
                    <br />
                  </div>
                ))
              ))
          )}
        </div>
        <div className={m.btnPositionig}>
          <button className={m.descriptionButton} onClick={() => handleTabClick("nephron")}>네프론 설명</button>
        </div>
      </div>
      <button className={`${m.toggleButton} ${isOpen ? m.open : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Popup Modal"
        className={m.modal}
        overlayClassName={m.overlay}
      >
        <h2>{modalContent?.title}</h2>
        <p>{modalContent?.content}</p>
        <label className={m.nottd}>
          <input
            type="checkbox"
            checked={dontShowToday}
            onChange={handleDontShowTodayChange}
          /> 오늘 하루 보지 않기
        </label>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
        <button
          onClick={() => window.location.href = 'https://www.superbin.co.kr/'} // 실제 URL로 변경하세요
          className={m.homepageButton} // 스타일을 추가하고 싶다면 클래스를 추가하세요
        >수퍼빈 홈페이지</button>
      </Modal>
      {/* {isOpen && (
        <div className={`${m.logoPane} ${isOpen ? m.open : ''}`}>
          <img src="/img/logo.png" alt="Logo" style={{ width: '225px', height: 'auto' }} />
        </div>
      )} */}
      {/* 오른쪽 아래 로고 */}
    </div>
  );
});

export default VendingDeviceMenu;