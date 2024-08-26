import { useCallback, useEffect, useMemo, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import KaKaoMapMenu from "./KakaoMapMenu";
const KakaoMapMarker = () => {
	const [locations, setLocations] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [center, setCenter] = useState({lat: 33.450701, lng: 126.570667});
	useEffect(() => {
		const fetchLocations = async () => {

			try {
				const res = await fetch(`http://127.0.0.1:8080/dataload`);
				const data = await res.json();
				
				console.log(data);  // 데이터 확인을 위한 로그
				setLocations(data);
			} catch (error) {
				console.error("Failed to fetch locations", error);
			}
		};
		fetchLocations();
	}, []);

	const filteredLocations = useMemo(() => {
		return locations.filter(loc =>
		loc.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		}, [locations, searchQuery]);

	const handleMarkerClick = useCallback((loc) => {
		setSearchQuery(loc.name);
		setCenter({ lat: loc.latitude, lng: loc.longitude});
	},[]);

	const getMarkerImage = useCallback((inputWastes) => {
		const wasteTypes = inputWastes.map(waste => waste.inputWaste);
		if(wasteTypes.includes("캔") && wasteTypes.includes("투명 페트")){
			return '/img/RecycleMarker.png';
		}
		else if(wasteTypes.includes("캔")){
			return '/img/CanMarker.png';
		}
		else if(wasteTypes.includes("투명 페트")){
			return '/img/PetBottleMarker.png';
		}
		else{
			return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
		}
	}, []);
	return (
		<div>
			<KaKaoMapMenu setSearchQuery={setSearchQuery} searchQuery={searchQuery} locations={filteredLocations} onLocationClick={handleMarkerClick}/>
			<Map center={center} style={{ width: '800px', height: '600px' }} level={3}>
				{filteredLocations.map((loc, idx) => (
					<MapMarker
						key={idx}
						position={{ lat: loc.latitude, lng: loc.longitude }}
						image={{
							src: getMarkerImage(loc.inputWastes),
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


export default KakaoMapMarker;