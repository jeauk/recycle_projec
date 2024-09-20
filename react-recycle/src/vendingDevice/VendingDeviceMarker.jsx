import { useState } from "react";
import { MapMarker } from "react-kakao-maps-sdk";

const VendingDeviceMarker = ({ position, content, handleMarkerClick, getMarkerImage, isMatch }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <MapMarker position={position}
            onClick={() => handleMarkerClick(content)}
            onMouseOver={() => setIsVisible(true)}
            onMouseOut={() => setIsVisible(false)}
            image={{
                src: getMarkerImage(content.inputWastes),
                size: { width: 44, height: 55 }
            }}
            title={content.name}
        >
            {isVisible && (
                <div style={{ padding: "2px", color: "#000" }}>
                    <h4>{content.name}</h4>
                    <p>{content.address}</p>
                </div>
            )}
        </MapMarker>
    );
};

export default VendingDeviceMarker