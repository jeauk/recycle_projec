import { useCallback, useEffect, useMemo, useState } from "react";
import { Map,  } from "react-kakao-maps-sdk";
import VendingDeviceMenu from "./VendingDeviceMenu";
import VendingDeviceMarker from "./VendingDeviceMarker";
const VendingDeviceMap = () => {
	const [locations, setLocations] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const [center, setCenter] = useState({ lat: 36.483509090944544, lng: 127.71692262315658});
	const [level, setLevel] = useState(12);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const myBackDomain = async () => {
			setLoading(true); // 로딩 시작
			try {
				const res = await fetch(`http://127.0.0.1:8080/dataload`);
				const data = await res.json();

				console.log(data);  // 데이터 확인을 위한 로그
				setLocations(data);
			} catch (error) {
				console.error("위치 데이터를 가져오는데 실패했습니다", error);
			} finally{
				setLoading(false); //로딩 끝
			}
		};
		myBackDomain();

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCenter({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
				setLevel(5);
			}, (error) => {
				console.error("사용자의 위치를 가져오는데 실패했습니다.",error);
			}
		);
	}, []);

	const filteredLocations = useMemo(() => {
		if (searchHistory.length === 0) {
			return locations.map((loc) => ({ ...loc, isMatch:true }));
		}
		return locations.map((loc) =>{
			const isMatch = searchHistory.every(query =>
				loc.name.toLowerCase().includes(query.toLowerCase()) ||
				loc.address.toLowerCase().includes(query.toLowerCase()) ||
				loc.region1.toLowerCase().includes(query.toLowerCase()) ||
				loc.region2.toLowerCase().includes(query.toLowerCase()) ||
				loc.region3.toLowerCase().includes(query.toLowerCase()) ||
				loc.inputWastes.some(waste => waste.inputWaste.toLowerCase().includes(query.toLowerCase()))
			);
			console.log(`Location: ${loc.name}, isMatch: ${isMatch}`);
			return {...loc, isMatch};
		}); 
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

	const getMarkerImage = useCallback((inputWastes, isMatch) => {
		const wasteTypes = inputWastes.map(waste => waste.inputWaste);
	
		// 검색어가 없을 때 기본 마커 이미지
		if (searchHistory.length === 0) {
			if (wasteTypes.includes("캔") && wasteTypes.includes("투명 페트")) {
				return '/img/RecycleMarker.png'; // 기본 RecycleMarker
			} else if (wasteTypes.includes("캔")) {
				return '/img/CanMarker.png'; // 기본 CanMarker
			} else if (wasteTypes.includes("투명 페트")) {
				return '/img/PetBottleMarker.png'; // 기본 PetBottleMarker
			} else {
				return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'; // 기본 스타 마커
			}
		}
	
		// 검색어가 있을 때의 로직
		if (isMatch) {
			// 검색어와 조건이 맞는 경우
			if (wasteTypes.includes("캔") && wasteTypes.includes("투명 페트")) {
				return '/img/RedRecycleMarker.png'; // Red가 붙은 이미지
			} else if (wasteTypes.includes("캔")) {
				return '/img/RedCanMarker.png'; // Red가 붙은 이미지
			} else if (wasteTypes.includes("투명 페트")) {
				return '/img/RedPetBottleMarker.png'; // Red가 붙은 이미지
			} else {
				return '/img/RedDefaultMarker.png'; // 검색어에 맞지 않을 때
			}
		} else {
			// 검색어와 조건이 맞지 않는 경우
			if (wasteTypes.includes("캔") && wasteTypes.includes("투명 페트")) {
				return '/img/IvRecycleMarker.png'; // Iv가 붙은 이미지
			} else if (wasteTypes.includes("캔")) {
				return '/img/IvCanMarker.png'; // Iv가 붙은 이미지
			} else if (wasteTypes.includes("투명 페트")) {
				return '/img/IvPetBottleMarker.png'; // Iv가 붙은 이미지
			} else {
				return '/img/IvDefaultMarker.png'; // 기본 Iv 이미지
			}
		}
	}, [searchHistory]);



	return (
		<div>
			<VendingDeviceMenu loading={loading} searchHistory={searchHistory} setSearchHistory={setSearchHistory} locations={filteredLocations} onLocationClick={handleMarkerClick} />
			<Map center={center} style={{ width: '800px', height: '600px' }} level={level}>
				{filteredLocations.map((loc, idx) => (
					<VendingDeviceMarker
						key={idx}
						position={{ lat: loc.latitude, lng: loc.longitude }}
						content={loc}
						handleMarkerClick={handleMarkerClick}
						getMarkerImage={(wastes) => getMarkerImage(wastes, loc.isMatch)} // isMatch를 전달
						/>
				))}
			</Map>
		</div>
	);
};


export default VendingDeviceMap;