import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import m from '../styles/VendingDeviceMenu.module.css';
import rm from '../styles/ReMap.module.css';

const ReMapMenu = React.memo(({ locations, onLocationClick, searchHistory, setSearchHistory, activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeButton, setActiveButton] = useState(activeTab);
  const menuRef = useRef(null);
  const mapRef = useRef(null);
  const mouseDownTimeRef = useRef(0); // 마우스를 누른 시간을 기록
  const drag = 100; // 클릭과 드래그를 구분하는 기준 시간 (밀리초)

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
  }, [setActiveTab]);

  const handleClickOutside = useCallback((event) => {
    const timeDiff = Date.now() - mouseDownTimeRef.current; // 마우스가 눌린 시간과 현재 시간의 차이 계산
    if (timeDiff < drag) {
      // 클릭과 드래그 구분: 클릭 시간이 짧을 때만 창을 닫음
      if (menuRef.current && !menuRef.current.contains(event.target) && !mapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    mouseDownTimeRef.current = Date.now(); // 마우스가 눌린 시간을 기록
  }, []);

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
          <p className={rm.searchres}><span className={rm.gsearch}>검색된 가게:</span> {filteredLocations.length}개</p>
          <button className={m.clearButton} onClick={clearSearch}>⟳</button>
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
    </div>
  );
});

export default ReMapMenu;
