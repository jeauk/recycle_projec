import { useCallback, useEffect, useMemo, useState } from "react";
import { Map,  } from "react-kakao-maps-sdk";
import VendingDeviceMenu from "./VendingDeviceMenu";
import VendingDeviceMarker from "./VendingDeviceMarker";
import m from '../styles/VendingDevice.module.css';
const VendingDeviceMap = () => {
	const [locations, setLocations] = useState([]);
	const [searchHistory, setSearchHistory] = useState([]);
	const [center, setCenter] = useState({ lat: 36.483509090944544, lng: 127.71692262315658});
	const [level, setLevel] = useState(12);
	const [loading, setLoading] = useState(false);

	const myBackDomain = "http://trashformer.site:8080";

	useEffect(() => {
		const backDomainFetch = async () => {
			setLoading(true); // 로딩 시작
			try {
				const res = await fetch(myBackDomain + "/dataload");
				const data = await res.json();

				console.log(data);  // 데이터 확인을 위한 로그
				setLocations(data);
			} catch (error) {
				console.error("위치 데이터를 가져오는데 실패했습니다", error);
			} finally{
				setLoading(false); //로딩 끝
			}
		};
		backDomainFetch();

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
		//검색어가 없을시 모든 마커를 반환
		if(searchHistory.length === 0){
			return locations.map(loc => ({ ...loc, isMatch: true }));
		}
		//검색후 조건에 맞는 마커와 isMatch 반환
		return locations.map(loc => {
		const isMatch = searchHistory.every(query =>
				loc.name.toLowerCase().includes(query.toLowerCase()) ||
				loc.address.toLowerCase().includes(query.toLowerCase()) ||
				loc.region1.toLowerCase().includes(query.toLowerCase()) ||
				loc.region2.toLowerCase().includes(query.toLowerCase()) ||
				loc.region3.toLowerCase().includes(query.toLowerCase()) ||
				loc.inputWastes.some(waste => waste.inputWaste.toLowerCase().includes(query.toLowerCase()))
			);
			return { ...loc, isMatch };
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
		const prefix = isMatch && searchHistory.length > 0 ? 'Red' : '';

		if (wasteTypes.includes("캔") && wasteTypes.includes("투명 페트")) {
			return `/img/${prefix}RecycleMarker.png`;
		}
		else if (wasteTypes.includes("캔")) {
			return `/img/${prefix}CanMarker.png`;
		}
		else if (wasteTypes.includes("투명 페트")) {
			return `/img/${prefix}PetBottleMarker.png`;
		}
		else {
			return 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
		}
	}, [searchHistory]);



	return (
		<div>
			<VendingDeviceMenu loading={loading} searchHistory={searchHistory} setSearchHistory={setSearchHistory} locations={filteredLocations} onLocationClick={handleMarkerClick} />
			<Map center={center} style={{ width: '80vw', height: '600px', marginTop: '10px' }} level={level}>
				{filteredLocations.map((loc, idx) => (
					loc.isMatch && (
						<VendingDeviceMarker
						key={idx}
						position={{ lat: loc.latitude, lng: loc.longitude }}
						content={loc}
						handleMarkerClick={handleMarkerClick}
						getMarkerImage={(wastes) => getMarkerImage(wastes, loc.isMatch)}
						/>
					)
					))}
			</Map>
		</div>
	);
};


export default VendingDeviceMap;