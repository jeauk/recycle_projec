import React, { useCallback, useMemo, useState } from 'react';
import m from '../styles/KaKaoMapMenu.module.css';

const ReMapMenu = React.memo(({ setSearchQuery, locations, searchQuery, onLocationClick, activeTab }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, [setSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const filteredLocations = useMemo(() => {
    return locations?.filter(loc => loc.type === activeTab && loc.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  }, [locations, searchQuery, activeTab]);

  return (
    <div>
      <div className={`${m.sideMenu} ${isOpen ? m.open : ''}`}>
        <div className={m.search}>
          <input type="text" placeholder="가게 위치 검색" onChange={handleSearchChange} value={searchQuery} />
          <p>검색된 가게: {filteredLocations.length}개</p>
          <button className={m.clearButton} onClick={clearSearch}>
            X
          </button>
        </div>
        <div className={`${m.KakaoMapList} ${isOpen ? m.open : ''}`}>
          {filteredLocations.map((loc, locIdx) => (
            <div key={locIdx} className={m.locationItem} onClick={() => onLocationClick(loc)}>
              <h4>{loc.name}</h4>
              <p>{loc.address}</p>
              <p>{loc.tel}</p>
              <br />
            </div>
          ))}
        </div>
      </div>
      <button className={`${m.toggleButton} ${isOpen ? m.open : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
    </div>
  );
});

export default ReMapMenu;
