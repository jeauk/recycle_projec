import { useState } from "react";
import { MapMarker } from "react-kakao-maps-sdk";

const ReMapMarker = ({ position, content, handleMarkerClick, getMarkerImage2 }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <MapMarker position={position}
      onClick={() => handleMarkerClick(content)}
      onMouseOver={() => setIsVisible(true)}
      onMouseOut={() => setIsVisible(false)}
      image={{
        src: getMarkerImage2(content.type),
        size: { width: 44, height: 55 },
      }}
      title={content.name}
    >
      {isVisible && (
        <div style={{width:"250px", padding: "2px", color: "#000" }}>
          <h4>{content.name}</h4>
          <p>{content.address}</p>
          <p>{content.tel}</p>
        </div>
      )}
    </MapMarker>
  )
}

export default ReMapMarker