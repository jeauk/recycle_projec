import React, { useState } from "react";
import ReMap from "../reMap/ReMap";
import KakaoMapMarker from "./KakaoMapMarker";

const KakaoMap = () => {
    const [activeComponent, setActiveComponent] = useState("KakaoMapMarker");

    return (
        <div>
            <nav style={{display:'flex', justifyContent: 'flex-end'}}>
                <button onClick={() => setActiveComponent("KakaoMapMarker")}>슈퍼빈자판기</button>
                <button onClick={() => setActiveComponent("ReMap")}>중고가게</button>
            </nav>
            {activeComponent === "KakaoMapMarker" && <KakaoMapMarker />}
            {activeComponent === "ReMap" && <ReMap />}
        </div>
    );
};

export default KakaoMap;
