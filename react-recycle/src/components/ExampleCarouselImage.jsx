import React from 'react';

function ExampleCarouselImage({ text }) {
  // 이미지 경로를 텍스트에 맞게 설정
  const imageSrc = `/img/${text.toLowerCase().replace(' ', '_')}.jpg`;

  return (
    <div>
      <img
        className="d-block w-100"
        src={imageSrc}
        alt={text}
      />
    </div>
  );
}

export default ExampleCarouselImage;
