const ReMapMarker = ({ position, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
      <MapMarker position={position}
          onClick={() => handleMarkerClick(content)}
          onMouseOver={() => setIsVisible(true)}
          onMouseOut={() => setIsVisible(false)}
          image={{
              src: getMarkerImage(content.type),
              size: { width: 44, height: 55 },
          }}
          title={content.name}
      >
          {isVisible && (
              <div style={{ padding: "2px", color: "#000" }}>
                  <h4>{content.name}</h4>
                  <p>{content.address}</p>
                  <p>{content.tel}</p>
              </div>
          )}
      </MapMarker>
  )
}

export default ReMapMarker