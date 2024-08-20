import { Map } from "react-kakao-maps-sdk";
import KakaoMapMarker from "./KakaoMapMarker";
import KaKaoMapMenu from "./KakaoMapMenu";

const KakaoMap = () => {
    return (
        <div>
            <KaKaoMapMenu />
            <KakaoMapMarker />
        </div>
    );
};

export default KakaoMap;