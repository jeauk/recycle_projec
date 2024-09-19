import { useCallback, useEffect, useMemo, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import ReMapMenu from "./ReMapMenu";
import ReMapMarker from "./ReMapMarker";

const ReMap = () => {
	const [locations, setLocations] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const [center, setCenter] = useState(null);
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

		const getUserLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setCenter({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						});
					},
				);
			}
		};

		fetchLocations();
		getUserLocation();
	}, []);

	const filteredLocations = useMemo(() => {
		if (searchHistory.length === 0) {
			return locations.filter(loc => loc.type === activeTab);
		}
		return locations.filter(loc =>
			loc.type === activeTab &&
			searchHistory.every(query =>
				loc.name.toLowerCase().includes(query.toLowerCase()) ||
				loc.address.toLowerCase().includes(query.toLowerCase())
			)
		);
	}, [locations, activeTab, searchHistory]);

	const handleMarkerClick = useCallback((loc) => {
		setCenter({ lat: loc.latitude, lng: loc.longitude });
		setSearchHistory(prev => {
			const newHistory = [...prev, loc.name].slice(-5);
			return newHistory;
		});
	}, []);

	const getMarkerImage = useCallback((type) => {
		if (type === "gwill") {
			return "/img/gw-marker.png";
		} else if (type === "bmarket") {
			return "/img/bg-marker.png";
		}
	}, []);

	return (
		<div>
			<ReMapMenu searchHistory={searchHistory} setSearchHistory={setSearchHistory} locations={filteredLocations} onLocationClick={handleMarkerClick} activeTab={activeTab} setActiveTab={setActiveTab} />
			{center && (
				<Map center={center} style={{ width: '99vw', height: '600px' }} level={3}>
					{filteredLocations.map((loc, idx) => (
						<ReMapMarker
							key={idx}
							position={{ lat: loc.latitude, lng: loc.longitude }}
							content={loc}
							handleMarkerClick={handleMarkerClick}
							getMarkerImage={getMarkerImage}
						/>
					))}
				</Map>
			)}
		</div>
	);
};

export default ReMap;
