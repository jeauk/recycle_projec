import React, { useCallback, useMemo, useState } from 'react';
import m from '../styles/VendingDeviceMenu.module.css';

const VendingDeviceMenu = React.memo(({ setSearchQuery, locations, searchQuery, onLocationClick }) => {  // setSearchQuery를 props로 받아옵니다
  const [isOpen, setIsOpen] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const toggleMenu = useCallback(()=>{
    setIsOpen(!isOpen);
  }, [isOpen]);



  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);  // 입력된 값을 setSearchQuery로 전달
  },[setSearchQuery]); // 이걸로 검색을 하지 않지만 일단 남겨둠

  const handleSearch = useCallback((query) => {setSearchQuery(query);},[setSearchQuery]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      if (searchQuery.trim() !=='' && !searchHistory.includes(searchQuery)) {
        const newHistory = [...searchHistory, searchQuery].slice(-5);
        setSearchHistory(newHistory);
      }
    }
  }, [searchQuery, searchHistory]);

  const totalVendingMachinces =  useMemo(()=>{
    return locations.reduce((total, loc) => total + loc.vendingDevices.length, 0);
  },[locations]);
  const clearSearch = useCallback(() => {
    setSearchQuery('');  // 검색어를 초기화
  }, [setSearchQuery]);
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
              <p key={index}>검색어{index + 1}: {query}</p>
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