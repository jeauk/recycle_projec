import React, { useRef, useState } from 'react';
import styles from '../styles/Carvon.module.css'; // CSS 모듈 불러오기
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Carvon = () => {
    const sliderRef = useRef(null); // Slider 참조를 위한 useRef 추가
    const [activeSlide, setActiveSlide] = useState(0); // 현재 활성화된 슬라이드 인덱스 관리

    const settings = {
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        afterChange: (current) => setActiveSlide(current), // 슬라이드가 변경될 때 호출
    };

    // 다음 화살표 커스텀 컴포넌트
    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "block", background: "none" }}
            onClick={onClick}
          >
            <img 
              src="/img/nextArrow.png" // 경로는 이미지가 저장된 경로에 맞게 설정하세요.
              alt="다음"
              style={{ width: '40px', height: '40px' }}
            />
          </div>
        );
    }

    // 이전 화살표 커스텀 컴포넌트
    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "block", background: "none" }}
            onClick={onClick}
          >
            <img 
              src="/img/prevArrow.png" // 경로는 이미지가 저장된 경로에 맞게 설정하세요.
              alt="이전"
              style={{ width: '40px', height: '40px' }}
            />
          </div>
        );
    }

    // 탭을 클릭할 때 해당 슬라이드로 이동하는 함수
    const goToSlide = (index) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index); // 해당 인덱스로 슬라이드 이동
        }
    };

    // 각 탭에 밑줄을 표시하는 스타일 적용
    const getTabStyle = (index) => {
        return activeSlide === index ? `${styles.activeTab}` : '';
    };

    return (
        <div className={styles.carvonContainer}>
            {/* 상단 탭 네비게이션 */}
            <div className={styles.tabs}>
                <span className={styles.tabTitle}>탄소중립포인트, 함께</span>
                <div className={styles.menu}>
                    <span 
                        className={`${styles.tabOne} ${getTabStyle(0)}`} 
                        onClick={() => goToSlide(0)} // 클릭 시 해당 슬라이드로 이동
                    >
                        제도소개
                    </span>
                    <span 
                        className={`${styles.tabTwo} ${getTabStyle(1)}`} 
                        onClick={() => goToSlide(1)} // 클릭 시 해당 슬라이드로 이동
                    >
                        인센티브 안내
                    </span>
                    <span 
                        className={`${styles.tabThree} ${getTabStyle(2)}`} 
                        onClick={() => goToSlide(2)} // 클릭 시 해당 슬라이드로 이동
                    >
                        참여방법
                    </span>
                    <span 
                        className={`${styles.tabFour} ${getTabStyle(3)}`} 
                        onClick={() => goToSlide(3)} // 클릭 시 해당 슬라이드로 이동
                    >
                        참여기업 안내
                    </span>
                </div>
            </div>

            {/* 슬라이더 */}
            <div className={styles.sliderContainer}>
                <Slider ref={sliderRef} {...settings}>
                    <div>
                        <img src="https://picsum.photos/600/400" alt="슬라이드 이미지 1" />
                    </div>
                    <div>
                        <img src="https://picsum.photos/600/400" alt="슬라이드 이미지 2" />
                    </div>
                    <div>
                        <img src="https://picsum.photos/600/400" alt="슬라이드 이미지 3" />
                    </div>
                    <div>
                        <img src="https://picsum.photos/600/400" alt="슬라이드 이미지 4" />
                    </div>
                </Slider>
            </div>
        </div>
    );
};

export default Carvon;
