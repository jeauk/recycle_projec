import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.py5}>
            <div className={styles.container}>
                <p className={styles.textCenter}>
                    Copyright &copy; Your Website 2024
                </p>
            </div>
        </footer>
    );
};

export default Footer;