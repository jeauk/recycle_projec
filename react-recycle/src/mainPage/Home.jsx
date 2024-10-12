import React from 'react';
import styles from '../styles/Home.module.css';  // CSS 파일 import
import Carvon from './Carvon';
import Card from './Card';

const Home = () => {
    return (
        <div>
            <div className={styles.gridContainer}>

                <div className={styles.slidersGridItem}>
                </div>
                <div className={styles.cardGridItem}>
                    <Card />
                </div>
                <div className={styles.carvonGridItem}>
                    <Carvon />
                </div>
                <div className={styles.gridItem}>

                </div>
            </div>
        </div>
    );
}

export default Home;
