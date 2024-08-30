import { useCallback, useEffect, useMemo, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import VendingDeviceMenu from "./VendingDeviceMenu";
const VendingDeviceMarker = () => {
	const [locations, setLocations] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchHistory, setSearchHistory] = useState([]);
	const [center, setCenter] = useState({lat: 33.450701, lng: 126.570667});
	useEffect(() => {
		const fetchLocations = async () => {

			try {
				const res = await fetch(`http://127.0.0.1:8080/dataload`);
				const data = await res.json();
				
				console.log(data);  // 데이터 확인을 위한 로그
				setLocations(data);
			} catch (error) {
				console.error("위치 데이터를 가져오는데 실패했습니다", error);
			}
		};
		fetchLocations();
	}, []);

	const filteredLocations = useMemo(() => {
		if (searchHistory.length === 0){
			return locations;
		}
		return locations.filter(loc =>
			searchHistory.every(query =>
		loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.address.toLowerCase().includes(query.toLowerCase()) ||
        loc.region1.toLowerCase().includes(query.toLowerCase()) ||
        loc.region2.toLowerCase().includes(query.toLowerCase()) ||
        loc.region3.toLowerCase().includes(query.toLowerCase()) ||
		loc.inputWastes.some(waste => waste.inputWaste.toLowerCase().includes(query.toLowerCase()))
			)
		);
		}, [locations, searchHistory]);

	const handleMarkerClick = useCallback((loc) => {
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
			<VendingDeviceMenu setSearchQuery={setSearchQuery} searchQuery={searchQuery} searchHistory={searchHistory} setSearchHistory={setSearchHistory} locations={filteredLocations} onLocationClick={handleMarkerClick}/>
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


export default VendingDeviceMarker;