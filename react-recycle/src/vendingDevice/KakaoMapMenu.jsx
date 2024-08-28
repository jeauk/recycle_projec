import React, { useCallback, useMemo, useState } from 'react';
import m from '../styles/KaKaoMapMenu.module.css';

const KaKaoMapMenu = React.memo(({ setSearchQuery, locations, searchQuery, onLocationClick }) => {  // setSearchQuery를 props로 받아옵니다
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = useCallback(()=>{
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);  // 입력된 값을 setSearchQuery로 전달
  },[setSearchQuery]);

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
          <input type="text" placeholder="자판기 위치 검색" onChange={handleSearchChange} value={searchQuery} />
          <p>검색된 자판기: {totalVendingMachinces}대</p>
          <button className={m.clearButton} onClick={clearSearch}>
            X
          </button>
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

export default KaKaoMapMenu;