import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/TopContents.module.css'; // CSS 모듈 임포트

const slides = [
    {
      id: 1,
      image: './img/benner1.png',
    },
    {
      id: 2,
      image: './img/benner2.png',
    },
    {
      id: 3,
      image: './img/benner3.png',
    }
  ];
  
  const TopContents = () => {
    const [currentIndex, setCurrentIndex] = useState(1); // 첫 번째 슬라이드 복제본이 표시되므로 초기값은 1
    const [isTransitioning, setIsTransitioning] = useState(true);
    const slideInterval = useRef(null);
  
    const handleTransitionEnd = () => {
      if (currentIndex === slides.length + 1) { // 마지막 슬라이드 다음이라면
        setIsTransitioning(false); // 트랜지션 없이 이동
        setCurrentIndex(1); // 첫 번째 슬라이드로 이동
      } else if (currentIndex === 0) { // 첫 번째 슬라이드 이전이라면
        setIsTransitioning(false);
        setCurrentIndex(slides.length); // 마지막 슬라이드로 이동
      }
    };
  
    // 3초마다 슬라이드 변경
    useEffect(() => {
      slideInterval.current = setInterval(() => {
        setIsTransitioning(true); // 트랜지션 활성화
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 3000);
  
      return () => clearInterval(slideInterval.current);
    }, []);
  
    // 인덱스 변경에 따른 트랜지션 효과 처리
    useEffect(() => {
      if (!isTransitioning) {
        const timeout = setTimeout(() => {
          setIsTransitioning(true); // 트랜지션을 다시 활성화
        }, 50); // 잠깐의 시간 동안 트랜지션 없이 이동 후 트랜지션을 활성화
        return () => clearTimeout(timeout);
      }
    }, [isTransitioning]);
  
    return (
      <div className={styles.sliderContainer}>
        <div
          className={styles.slidesWrapper}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* 마지막 슬라이드를 첫 번째 앞에 복제 */}
          <div className={styles.slide}>
            <img 
              src={slides[slides.length - 1].image} 
              alt={`slide-${slides.length}`} 
              style={{ width: '100%', height: '50%' }}
            />
          </div>
          {/* 실제 슬라이드 */}
          {slides.map((slide, index) => (
            <div className={styles.slide} key={index}>
              <img 
                src={slide.image} 
                alt={`slide-${index + 1}`} 
                style={{ width: '100%', height: '50%' }}
              />
            </div>
          ))}
          {/* 첫 번째 슬라이드를 마지막 뒤에 복제 */}
          <div className={styles.slide}>
            <img 
              src={slides[0].image} 
              alt={`slide-1`} 
              style={{ width: '100%', height: '50%' }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default TopContents;