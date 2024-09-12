import React, { useCallback, useMemo, useState } from 'react';
import m from '../styles/VendingDeviceMenu.module.css';

const VendingDeviceMenu = React.memo(({  locations, onLocationClick, searchHistory, setSearchHistory, loading }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const toggleMenu = useCallback(()=>{
    setIsOpen(!isOpen);
  }, [isOpen]);
  



  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  },[]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery !=='' && !searchHistory.includes(trimmedQuery)) {
        const newHistory = [...searchHistory, trimmedQuery].slice(-5);
        setSearchHistory(newHistory);
        setSearchQuery('');
      }
    }
  }, [searchQuery, searchHistory, setSearchHistory]);

  const handleSearchClick = useCallback((index) => {
    const newHistory = searchHistory.filter((_, idx) => idx !== index); setSearchHistory(newHistory);
  }, [searchHistory, setSearchHistory]);

  const totalVendingMachinces =  useMemo(()=>{
    return locations.reduce((total, loc) => total + loc.vendingDevices.length, 0);
  },[locations]);
  
  const clearSearch = useCallback(() => {
    setSearchHistory([]);
  }, [setSearchHistory]);
  
  const handleLocationClick = useCallback((loc) => {
    onLocationClick(loc);
  }, [onLocationClick, setSearchHistory])

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
              <p key={index} className={m.searchHistoryItem} onClick={() => handleSearchClick(index)}>검색어{index + 1}: {query}</p>
            ))}
          </div>
        </div>
        <div className={`${m.KakaoMapList} ${isOpen ? m.open : ''} ${loading ? m.loading : ''}`}>
          {loading ? (
            <div className={m.VendingDeviceLoading}>
              <img src="/img/VendingLoading.gif" alt="Loading..." />
              <h4>Loading...</h4>
            </div>
          ) : (
            locations.map((loc, locIdx) => (
              loc.vendingDevices.map((device, deviceIdx) => (
                <div key={`${locIdx}-${deviceIdx}`} className={m.locationItem} onClick={() => handleLocationClick(loc)}>
                <h4>{loc.vendingDevices.length === 1 ? loc.name : `${loc.name} ${deviceIdx + 1}`}</h4>
                <p>{loc.address}</p>
                <p>{device.recycleType}</p>
                <br />
                </div>
              ))
            ))
          )}
        </div>
      </div>
      <button className={`${m.toggleButton} ${isOpen ? m.open : ''}`} onClick={toggleMenu}>
        {isOpen ? '<' : '>'}
      </button>
    </div>
  );
});

export default VendingDeviceMenu;