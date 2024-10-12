import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import m from '../styles/VendingDeviceMenu.module.css';
import rm from '../styles/ReMap.module.css';

Modal.setAppElement('#root');

const ReMapMenu = React.memo(({ locations, onLocationClick, searchHistory, setSearchHistory, activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState(activeTab);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [dontShowToday, setDontShowToday] = useState(false); // 오늘 보이지 않기 체크박스 상태
  const menuRef = useRef(null);
  const mapRef = useRef(null);
  const mouseDownTimeRef = useRef(0);
  const drag = 100;
  const POPUP_KEY = `dontShowPopup_${activeTab}`;

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

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
    const newHistory = searchHistory.filter((_, idx) => idx !== index);
    setSearchHistory(newHistory);
  }, [searchHistory, setSearchHistory]);

  const filteredLocations = useMemo(() => {
    return locations?.filter(loc =>
      loc.type === activeTab &&
      (loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [locations, searchQuery, activeTab]);

  const clearSearch = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);

  const handleLocationClick = useCallback((loc) => {
    onLocationClick(loc);
  }, [onLocationClick]);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setActiveButton(tab);
    setDontShowToday(false); // 탭이 변경될 때마다 체크박스를 초기화
    if (tab === "gwill") {
      setModalContent({
        title: "굿윌스토어 안내문",
        content: (<>
          옷 외에도 생활·주방잡화, 가방·신발 같은 패션잡화부터 가전, 가구까지 다양한 물품을 기부할 수 있어요. 기부한 물건은 물품의 가격을 책정해 기부금으로 인정해 드립니다. <br /><br />
          기부금 영수증을 신청하면 연말 정산할 때 기부금의 일정 비율만큼 세액공제를 받을 수 있어요.
          2022년 기준 기부금 1천만원이하 20%, 1천만원 초과분은 35% 세액공제를 받을 수 있어요.
          단. 재판매가 가능할 만큼 사용가능한 물품이어야 기부로 인정받을 수 있고, 의류의 경우 세탁은 필수이고 제조년도가 오래된 책이나 가전의 경우는 인정받을 수 없습니다. <br /><br />
          기부물품은 직접 방문하여 수거하거나, 택배 혹은 매장에서 직접 기부할 수 있습니다.
          택배의 경우 택배기부 접수 후 발송해야 하며, 택배비는 본인 부담입니다.
          임의로 보낸 택배물품에 대해서는 익명기부처리되어 기부금 영수증이 발급되지 않으니 유의해주세요.<br /><br />
          온라인 물품기부 접수시 기부영수증 신청이 가능하며 매장방문 물품기부시에도 기부영수증 신청을 할 수 있습니다.
          물품 기부하신 후에도 기부영수증이 받고 싶다면 기부한 매장이나 대표전화로도 신청이 가능합니다.
          기부영수증을 받으려면, 온라인 신청시 기증 신청란에 개인정보를 적고 기증센터 방문시에는 기증품인수증에 작성해주면 됩니다.
          기부금영수증은 기증완료 후 자동 발급됩니다.
          영수증을 미신청했는데 발급받고 싶다면 통합센터로 문의하면 받을 수 있습니다.<br /><br />
          기증접수 : 홈페이지, 전화 접수 1670-9125 또는 가까운 지점 전화접수<br />
          방문수거 : 3박스(우체국 5호박스이상) 이상 종량제 50L 2봉지 이상<br />
          택배수거 ; 방문 수거불가능 지역 1박스 이상(박스 패킹만 수거 | 선불)<br />
          소득공제는 접수시 제공해준 정보로 자동으로 신고됩니다, 소득공제알림 발송은 지점마다 상이할 수 있습니다.
        </>),
      });
    } else if (tab === "bmarket") {
      setModalContent({
        title: "아름다운가게 안내문",
        content: (<>
          더 큰 나눔을 위해 판매 가능한 물품을 기부해주세요.<br />
          세탁, 수선을 하지 못하므로 깨끗하게 정리해서 보내주시면 좋아요.<br />
          재판매가 어려운 기부물품은 기부금영수증 가액 산정에 반영되지 않는 점, 미리 양해 부탁드려요.<br />
          개인은 기부 후 받으신 알림톡의 [기부금영수증 신청하기]를 통해 직접 신청 정보(이름, 주민등록번호)입력 후, 8일 후 조회 가능하며
          사업자는 사업자등록증 상의 정보(상호명, 사업자등록번호, 사업장 소재지)로 직접 기부금영수증 신청 후, 2-3주 이내 이메일 발송드립니다.<br /><br />
          기부물품은 센터로 입고된 후에는 다시 찾기 어려우므로 기부하기 전에 한 번 더 확인해주세요.<br />

          전화 방문 수거 신청 : 1577-1113으로 전화하여 직원의 안내에 따라 물품기부를 신청할 수 있습니다.<br />
          - 월~금, 오전 9시~오후 6시<br />
          - 점심시간(평일 12시~13시)<br />
          ※우체국 5호 박스 또는 종량제 봉투 50L 기준 3개 이상<br /><br />

          온라인 물품기부신청 : 홈페이지를 통해 언제든 기부 물품 수거를 신청할 수 있습니다<br />
          ※ 우체국 5호 박스 또는 종량제 봉투 50L 기준 3개 이상<br /><br />

          매장방문 기부 : 운영시간 내에 직접 방문, 3박스(봉투) 미만<br />

          ※1박스(봉투)당 무게는 15kg 이내가 적당합니다
        </>)
      });
    }
    setIsModalOpen(true);
  }, [setActiveTab]);

  const handleClickOutside = useCallback((event) => {
    const timeDiff = Date.now() - mouseDownTimeRef.current;
    if (timeDiff < drag) {
      if (menuRef.current && !menuRef.current.contains(event.target) && !mapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    mouseDownTimeRef.current = Date.now();
  }, []);

  // '오늘 하루 보이지 않기' 체크박스를 클릭하면 로컬 스토리지에 저장
  const handleDontShowTodayChange = useCallback(() => {
    const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24시간 후
    setDontShowToday(!dontShowToday);
    localStorage.setItem(POPUP_KEY, expirationTime); // 로컬 스토리지에 만료 시간 저장
  }, [dontShowToday, POPUP_KEY]);

  // 컴포넌트가 로드될 때 로컬 스토리지를 확인하여 팝업을 표시할지 결정
  useEffect(() => {
    const storedTime = localStorage.getItem(POPUP_KEY);
    if (storedTime && new Date().getTime() < storedTime) {
      setIsModalOpen(false);
    } else {
      handleTabClick(activeTab);
    }
  }, [activeTab, handleTabClick, POPUP_KEY]);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, handleMouseDown]);

  return (
    <div className={rm.rewrap} ref={menuRef}>
      <div className={`${m.sideMenu} ${isOpen ? m.open : ''}`}>
        <div className={m.search}>
          <input type="text" placeholder="중고 가게 위치 검색" onChange={handleSearchChange} value={searchQuery} onKeyDown={handleKeyPress} />
          <div className={rm.searchres}>
            <p><span className={rm.gsearch}>검색된 가게:</span> {filteredLocations.length}개</p>
            <button className={m.clearButton} onClick={clearSearch}>검색 초기화</button>
          </div>
          <div>
            {searchHistory.map((query, index) => (
              <p key={index} onClick={() => handleSearchClick(index)} className={rm.select}>검색어{index + 1}: {query}</p>
            ))}
          </div>
        </div>
        <div className={`${rm.reMapList} ${isOpen ? m.open : ''}`} ref={mapRef}>
          {filteredLocations.map((loc, locIdx) => (
            <div key={locIdx} className={rm.res} onClick={() => handleLocationClick(loc)}>
              <h4>{loc.name}</h4>
              <p>{loc.address}</p>
              <p>{loc.tel}</p>
              <br />
            </div>
          ))}
        </div>
        <div className={rm.btn}>
          <button className={`${rm.btn1} ${activeButton === "gwill" ? rm.active : ''}`} onClick={() => handleTabClick("gwill")}>굿윌스토어</button>
          <button className={`${rm.btn2} ${activeButton === "bmarket" ? rm.active : ''}`} onClick={() => handleTabClick("bmarket")}>아름다운가게</button>
        </div>
      </div>
      <button className={`${m.toggleButton} ${isOpen ? m.open : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Popup Modal"
        className={rm.modal}
        overlayClassName={rm.overlay}
      >
        <h2>{modalContent?.title}</h2>
        <p className={rm.modalContent}>{modalContent?.content}</p>
        <label className={rm.nottd}>
          <input
            type="checkbox"
            checked={dontShowToday}
            onChange={handleDontShowTodayChange}
          /> 오늘 하루 보지 않기
        </label>
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
});

export default ReMapMenu;
