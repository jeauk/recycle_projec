import React from 'react';
import styles from '../styles/Home.module.css';  // CSS 파일 import
import Carvon from './Carvon';
import Card from './Card';
import TopFiveList from './TopFiveList';
import Quiz from './Quiz';

const Home = () => {
    return (
        <div>
            <div className={styles.gridContainer}>

                <div className={styles.slidersGridItem}>
                    <img src='/img/mainBener.png'></img>
                </div>
                <div className={styles.cardGridItem}>
                    <Card />
                </div>
                <div className={styles.carvonGridItem}>
                    <Carvon />
                </div>
                <div className={styles.topFiveGridItem}>
                    <TopFiveList/>
                </div>
                <div className={styles.QuizGridItem}>
                    <Quiz />
                </div>
            </div>
        </div>
    );
}

export default Home;
