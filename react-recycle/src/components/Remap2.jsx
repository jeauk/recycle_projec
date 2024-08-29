import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import ReMapMenu from "./ReMapMenu";

const ReMapMarker = () => {
	const [locationsG, setLocationsG] = useState([]);
	const [locationsB, setLocationsB] = useState([]);
	const [userLocation, setUserLocation] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState('gwill');

	useEffect(() => {
		const fetchGLocations = async () => {
			try {
				const res = await fetch(`http://127.0.0.1:8080/gwill`);
				const data = await res.json();
				
				console.log(data);  // 데이터 확인을 위한 로그
				setLocationsG(data);
			} catch (error) {
				console.error("Failed to fetch locations", error);
			}
		};
		fetchGLocations();
	}, []);

	useEffect(() => {
		const fetchBLocations = async () => {
			try {
				const res = await fetch(`http://127.0.0.1:8080/bmarket`);
				const data = await res.json();
				
				console.log(data);  // 데이터 확인을 위한 로그
				setLocationsB(data);
			} catch (error) {
				console.error("Failed to fetch locations", error);
			}
		};
		fetchBLocations();
	}, []);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { latitude, longitude } = position.coords;
				setUserLocation({ lat: latitude, lng: longitude });
			}, (error) => {
				console.error("Failed to get user location", error);
			});
		}
	}, []);

	const handleTabClick = (tab) => {
		setActiveTab(tab);
	};

	return (
		<div>
			<div>
				<button onClick={() => handleTabClick('gwill')}>굿윌스토어</button>
				<button onClick={() => handleTabClick('bmarket')}>아름다운가게</button>
			</div>
			<ReMapMenu setSearchQuery={setSearchQuery} searchQuery={searchQuery} locations={filteredLocations} onLocationClick={handleMarkerClick} />
			{userLocation && (
				<Map center={userLocation} style={{ width: '800px', height: '600px' }} level={3}>
					<MapMarker
						position={userLocation}
						title="내 위치"
					/>
					{activeTab === 'gwill' && locationsG.map((location, index) => (
						<MapMarker
							key={index}
							position={{ lat: location.lat, lng: location.lng }}
							image={{
								src: `${process.env.PUBLIC_URL}/img/gw-marker.png`, // 마커 이미지 경로
								size: {
									width: 34,
									height: 45,
								},
							}}
						/>
					))}
					{activeTab === 'bmarket' && locationsB.map((location, index) => (
						<MapMarker
							key={index}
							position={{ lat: location.lat, lng: location.lng }}
							image={{
								src: `${process.env.PUBLIC_URL}/img/bg-marker.png`, // 마커 이미지 경로
								size: {
									width: 44,
									height: 55,
								},
							}}
						/>
					))}
				</Map>
			)}
		</div>
	);
};

export default ReMapMarker;
