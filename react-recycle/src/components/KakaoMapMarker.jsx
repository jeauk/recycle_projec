import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
const KakaoMapMarker = () => {
    const [locations, setLocations] = useState([]);
    useEffect(()=>{
        const fetchlocations = async () =>{

        try {
            const res = await fetch('http://127.0.0.1:8080/dataload');
            const data = await res.json();
            setLocations(data);
        }catch(error){
            console.error("Failed to fetch locations", error);
        }
    };
    fetchlocations();
    }, []);

	return (
		<Map center={{ lat: 33.450701, lng: 126.570667 }} style={{ width: '800px', height: '600px' }} level={3}>
			{locations.map((loc, idx) => (
				<MapMarker
					key={idx}
					position={{ lat: loc.latitude, lng: loc.longitude}}
					image={{
						src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
						size: { width: 24, height: 35 },
					}}
					title={loc.name}
				/>
			))}
		</Map>
	);
};


export default KakaoMapMarker;