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
        <div>
            <div className={styles.sliders}>
                <img
                    src='/img/mainBener.png'
                    alt='Main Banner'
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer', width: '100%' }}
                />
            </div>
            <div>
                <div className={styles.gridContainer}>
                    <div className={styles.cardGridItem}>
                        <Card />
                    </div>
                    <div className={styles.carvonGridItem}>
                        <Carvon />
                    </div>
                    <div className={styles.topFiveGridItem}>
                        <TopFiveList />
                    </div>
                </div>
                <div className={styles.QuizGridItem}><Quiz /></div>
            </div>
        </div>
    );
};

export default Home;
