import React from 'react';
import styles from '../styles/Nav.module.css';
import { Link } from 'react-router-dom';


const Nav = () => {
    return (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                <Link to="/category1" className={styles.navItem}>
                    <li className={styles.navLink}>Category 1</li>
                </Link>
                <Link to="/category2" className={styles.navItem}>
                    <li className={styles.navLink}>Category 2</li>
                </Link>
                <Link to="/category3" className={styles.navItem}>
                    <li className={styles.navLink}>Category 3</li>
                </Link>
                <Link to="/map" className={styles.navItem}>
                    <li className={styles.navLink}>지도</li>
                </Link>
                <Link to="/remap" className={styles.navItem}>
                    <li className={styles.navLink}>중고가게 지도</li>
                </Link>
            </ul>
        </nav>
    );
};

export default Nav;
