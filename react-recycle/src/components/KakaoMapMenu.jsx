import React, { useState } from 'react';
import '../styles/KakaoMapMenu.css';

const KaKaoMapMenu = ({ setSearchQuery, locations, searchQuery }) => {  // setSearchQuery를 props로 받아옵니다
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);  // 입력된 값을 setSearchQuery로 전달
  };

  const clearSearch = () => {
    setSearchQuery('');  // 검색어를 초기화
  };
  return (
    <div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="search">
          <input type="text" placeholder="자판기 위치 검색" onChange={handleSearchChange} value={searchQuery}/>
            <button className="clear-button" onClick={clearSearch}>
              X
            </button>
        </div>
        <div className={`KakaoMapList ${isOpen ? 'open' : ''}`}>
          {locations.map((loc, idx) => (  // locations를 순회하며 리스트를 생성합니다.
            <div key={idx} className="location-item">
              <h4>{loc.name}</h4>
              <p>{loc.address}</p>
              <br/>
            </div>
          ))}
        </div>
      </div>
      <button className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
    </div>
  );
};

export default KaKaoMapMenu;
