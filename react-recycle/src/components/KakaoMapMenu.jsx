import React, { useCallback, useState } from 'react';
import '../styles/KakaoMapMenu.css';

const KaKaoMapMenu = React.memo(({ setSearchQuery, locations, searchQuery, onLocationClick }) => {  // setSearchQuery를 props로 받아옵니다
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = useCallback(()=>{
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);  // 입력된 값을 setSearchQuery로 전달
  },[setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');  // 검색어를 초기화
  }, [setSearchQuery]);
  return (
    <div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="search">
          <input type="text" placeholder="자판기 위치 검색" onChange={handleSearchChange} value={searchQuery} />
          <button className="clear-button" onClick={clearSearch}>
            X
          </button>
        </div>
        <div className={`KakaoMapList ${isOpen ? 'open' : ''}`}>
          {locations.map((loc, locIdx) => (
            loc.vendingDevices.map((device, deviceIdx) => (
              <div key={`${locIdx}-${deviceIdx}`} className="location-item" onClick={() => onLocationClick(loc)}>
                <h4>{loc.vendingDevices.length === 1 ? loc.name : `${loc.name} ${deviceIdx + 1}`}</h4>
                <p>{loc.address}</p>
                <p>{device.recycleType}</p>
                <br />
              </div>
            ))
          ))}
        </div>
      </div>
      <button className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
    </div>
  );
});

export default KaKaoMapMenu;