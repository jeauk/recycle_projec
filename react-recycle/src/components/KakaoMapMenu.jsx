import React, { useState } from 'react';
import '../styles/KakaoMapMenu.css';

const KaKaoMapMenu = ({ setSearchQuery }) => {  // setSearchQuery를 props로 받아옵니다
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);  // 입력된 값을 setSearchQuery로 전달
  };

  return (
    <div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="search">
          <input type="text" placeholder="자판기 위치 검색" onChange={handleSearchChange} />
        </div>
      </div>
      <button className={`toggle-button ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
    </div>
  );
};

export default KaKaoMapMenu;
