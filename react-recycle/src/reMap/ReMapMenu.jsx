import React, { useCallback, useMemo, useState } from 'react';
import m from '../styles/KaKaoMapMenu.module.css';

const ReMapMenu = React.memo(({ locations, onLocationClick, searchHistory, setSearchHistory, activeTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
  }, [onLocationClick, setSearchHistory]);

  return (
    <div>
      <div className={`${m.sideMenu} ${isOpen ? m.open : ''}`}>
        <div className={m.search}>
          <input type="text" placeholder="중고 가게 위치 검색" onChange={handleSearchChange} value={searchQuery} onKeyDown={handleKeyPress} />
          <p>검색된 가게: {filteredLocations.length}개</p>
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
          {filteredLocations.map((loc, locIdx) => (
            <div key={locIdx} className={m.locationItem} onClick={() => handleLocationClick(loc)}>
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
