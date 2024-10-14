import React from 'react';
import styles from '../styles/Home.module.css'; // CSS 파일 import
import Carvon from './Carvon';
import Card from './Card';
import TopFiveList from './TopFiveList';
import Quiz from './Quiz';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 이미지 클릭 시 '/ai' 경로로 이동하는 함수
    const handleImageClick = () => {
        navigate('/ai');
    };

    return (
        <div className={styles.container}>
            {/* 메인 배너 */}
            <div className={styles.bannerContainer}>
                <img
                    src='/img/mainBener.png'
                    alt='Main Banner'
                    onClick={handleImageClick}
                    className={styles.bannerImage}
                />
            </div>

            {/* 그리드 레이아웃 (각 아이템이 한 줄에 하나씩 배치됨) */}
            <div className={styles.gridContainer}>
                <div className={styles.gridItem}>
                    <Card />
                </div>
                <div className={styles.gridItem}>
                    <Carvon />
                </div>
                <div className={styles.gridItem}>
                    <TopFiveList />
                </div>
            </div>

            {/* 퀴즈 영역 */}
            <div className={styles.quizContainer}>
                <Quiz />
            </div>
        </div>
    );
};

export default Home;
