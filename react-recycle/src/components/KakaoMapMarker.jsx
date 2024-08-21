import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import KaKaoMapMenu from "./KakaoMapMenu";
const KakaoMapMarker = () => {
	const [locations, setLocations] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	useEffect(() => {
		const fetchLocations = async () => {

			try {
				const res = await fetch(`http://127.0.0.1:8080/dataload?query=${searchQuery}`);
				const data = await res.json();
				setLocations(data);
			} catch (error) {
				console.error("Failed to fetch locations", error);
			}
		};
		fetchLocations();
	}, [searchQuery]);

	return (
		<div>
			<KaKaoMapMenu setSearchQuery={setSearchQuery} searchQuery={searchQuery} locations={locations}/> {/* setSearchQuery를 props로 전달합니다 */}
			<Map center={{ lat: 33.450701, lng: 126.570667 }} style={{ width: '800px', height: '600px' }} level={3}>
				{locations.map((loc, idx) => (
					<MapMarker
						key={idx}
						position={{ lat: loc.latitude, lng: loc.longitude }}
						image={{
							src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
							size: { width: 24, height: 35 },
						}}
						title={loc.name}
						onClick={() => setSearchQuery(loc.name)} 
					/>
				))}
			</Map>
		</div>
	);
};


export default KakaoMapMarker;