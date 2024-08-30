import React, { useCallback, useMemo, useState } from 'react';
import m from '../styles/VendingDeviceMenu.module.css';

const VendingDeviceMenu = React.memo(({ setSearchQuery, locations, searchQuery, onLocationClick, setSearchHistory, searchHistory }) => {  // setSearchQuery를 props로 받아옵니다
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = useCallback(()=>{
    setIsOpen(!isOpen);
  }, [isOpen]);



  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  },[setSearchQuery]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery !=='' && !searchHistory.includes(trimmedQuery)) {
        const newHistory = [...searchHistory, trimmedQuery].slice(-5);
        setSearchHistory(newHistory);
        setSearchQuery('');
      }
    }
  }, [searchQuery, searchHistory, setSearchQuery, setSearchHistory]);

  const handleSearchClick = useCallback((index) => {
    const newHistory = searchHistory.filter((_, idx) => idx !== index); setSearchHistory(newHistory);
  }, [searchHistory, setSearchHistory]);

  const totalVendingMachinces =  useMemo(()=>{
    return locations.reduce((total, loc) => total + loc.vendingDevices.length, 0);
  },[locations]);
  
  const clearSearch = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return (
    <div>
      <div className={`${m.sideMenu} ${isOpen ? m.open : ''}`}>
        <div className={m.search}>
          <input type="text" placeholder="자판기 위치 검색" onChange={handleSearchChange} value={searchQuery} onKeyDown={handleKeyPress}/>
          <p>검색된 자판기: {totalVendingMachinces}대</p>
          <button className={m.clearButton} onClick={clearSearch}>
            X
          </button>
          <div>
            {searchHistory.map((query, index) => (
              <p key={index} onClick={() => handleSearchClick(index)}>검색어{index + 1}: {query}</p>
            ))}
          </div>
        </div>
        <div className={`${m.KakaoMapList} ${isOpen ? m.open : ''}`}>
          {locations.map((loc, locIdx) => (
            loc.vendingDevices.map((device, deviceIdx) => (
              <div key={`${locIdx}-${deviceIdx}`} className={m.locationItem} onClick={() => onLocationClick(loc)}>
                <h4>{loc.vendingDevices.length === 1 ? loc.name : `${loc.name} ${deviceIdx + 1}`}</h4>
                <p>{loc.address}</p>
                <p>{device.recycleType}</p>
                <br />
              </div>
            ))
          ))}
        </div>
      </div>
      <button className={`${m.toggleButton} ${isOpen ? m.open : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
    </div>
  );
});

export default VendingDeviceMenu;