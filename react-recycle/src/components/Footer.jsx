import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={`${styles.py5} ${styles.bgDark}`}>
            <div className={styles.container}>
                <p className={`${styles.m0} ${styles.textCenter} ${styles.textWhite}`}>
                    Copyright &copy; Your Website 2023
                </p>
            </div>
        </footer>
    );
};

export default Footer;