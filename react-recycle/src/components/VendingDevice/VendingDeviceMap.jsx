import { useCallback, useEffect, useMemo, useState } from "react";
import { Map,  } from "react-kakao-maps-sdk";
import VendingDeviceMenu from "./VendingDeviceMenu";
import VendingDeviceMarker from "./VendingDeviceMarker";
const VendingDeviceMap = () => {
	const [locations, setLocations] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const [center, setCenter] = useState({ lat: 36.483509090944544, lng: 127.71692262315658});
	const [level, setLevel] = useState(12);
	
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

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCenter({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				})
				setLevel(5);
			}, (error) => {
				console.error("사용자의 위치를 가져오는데 실패했습니다.",error);
			}
		);
	}, []);

	const filteredLocations = useMemo(() => {
		if (searchHistory.length === 0) {
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
		setCenter({ lat: loc.latitude, lng: loc.longitude });
		setSearchHistory(prev => {
			const newHistory = [...prev];
			if(!newHistory.includes(loc.name)){
				newHistory.push(loc.name);
			}
			return newHistory.slice(-5);
		});
	}, []);

	const getMarkerImage = useCallback((inputWastes) => {
		const wasteTypes = inputWastes.map(waste => waste.inputWaste);
		if (wasteTypes.includes("캔") && wasteTypes.includes("투명 페트")) {
			return '/img/RecycleMarker.png';
		}
		else if (wasteTypes.includes("캔")) {
			return '/img/CanMarker.png';
		}
		else if (wasteTypes.includes("투명 페트")) {
			return '/img/PetBottleMarker.png';
		}
		else {
			return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
		}
	}, []);



	return (
		<div>
			<VendingDeviceMenu searchHistory={searchHistory} setSearchHistory={setSearchHistory} locations={filteredLocations} onLocationClick={handleMarkerClick} />
			<Map center={center} style={{ width: '800px', height: '600px' }} level={level}>
				{filteredLocations.map((loc, idx) => (
					<EventMarkerContainer
						key={idx}
						position={{ lat: loc.latitude, lng: loc.longitude }}
						content={loc}
						handleMarkerClick={handleMarkerClick}
						getMarkerImage={getMarkerImage}
						/>
				))}
			</Map>
		</div>
	);
};


export default VendingDeviceMap;