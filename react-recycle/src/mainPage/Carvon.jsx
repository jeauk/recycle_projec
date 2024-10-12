import React from 'react';
import styles from '../styles/Carvon.module.css'; // CSS 모듈 불러오기
import { useNavigate } from 'react-router-dom';

const Carvon = () => {
    const navigate = useNavigate();

    // 각 버튼에 대한 클릭 핸들러 설정
    const handleNavigate = (path) => {
        navigate(path); // 내부 경로로 이동
    };

    return (
        <div className={styles.carvonContainer}>
            <div className={styles.tabs}>
                <span className={styles.tabTitle}>탄소중립포인트, 함께</span>
                <div className={styles.menu}>
                    <span className={styles.tabOne}>제도소개</span>
                    <span className={styles.tabTwo}>인셉티브 안내</span>
                    <span className={styles.tabThree}>참여방법</span>
                    <span className={styles.tabFour}>참여기업 안내</span>
                </div>
            </div>
            <div className={styles.content}>
                <img src='#' alt="설명 이미지" />
            </div>
        </div>
    );
};

export default Carvon;
