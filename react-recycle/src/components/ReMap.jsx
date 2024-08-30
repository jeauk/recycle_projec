import { useCallback, useEffect, useMemo, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import ReMapMenu from "./ReMapMenu";

const ReMapMarker = () => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [center, setCenter] = useState({ lat: 33.450701, lng: 126.570667 });
  const [activeTab, setActiveTab] = useState("gwill");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const gwillRes = await fetch(`http://127.0.0.1:8080/gwill`);
        const gwillData = await gwillRes.json();

        const bmarketRes = await fetch(`http://127.0.0.1:8080/bmarket`);
        const bmarketData = await bmarketRes.json();

        const combinedData = [
          ...gwillData.map(loc => ({ ...loc, type: "gwill" })),
          ...bmarketData.map(loc => ({ ...loc, type: "bmarket" }))
        ];

        console.log(combinedData);  // 데이터 확인을 위한 로그
        setLocations(combinedData);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };
    fetchLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc =>
      loc.type === activeTab &&
      (loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [locations, searchQuery, activeTab]);

  const handleMarkerClick = useCallback((loc) => {
    setCenter({ lat: loc.latitude, lng: loc.longitude });
  }, []);

  const getMarkerImage = (type) => {
    if (type === "gwill") {
      return "/img/gw-marker.png";
    } else if (type === "bmarket") {
      return "/img/bg-marker.png";
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setActiveTab("gwill")}>굿윌스토어</button>
        <button onClick={() => setActiveTab("bmarket")}>아름다운가게</button>
      </div>
      <ReMapMenu
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        locations={filteredLocations}
        onLocationClick={handleMarkerClick}
        activeTab={activeTab}
        setSearchHistory={setSearchHistory}
        searchHistory={searchHistory}
      />
      <Map center={center} style={{ width: '800px', height: '600px' }} level={3}>
        {filteredLocations.map((loc, idx) => (
          <MapMarker
            key={idx}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            image={{
              src: getMarkerImage(loc.type),
              size: { width: 44, height: 55 },
            }}
            title={loc.name}
            onClick={() => handleMarkerClick(loc)}
          />
        ))}
      </Map>
    </div>
  );
};

export default ReMapMarker;
