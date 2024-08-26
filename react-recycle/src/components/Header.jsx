import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Header = () => {
    return (
        <header className={styles.py5}>
            <div className={`${styles.container} ${styles.pxLg5}`}>
                <div className={`${styles.p4} ${styles.pLg5} ${styles.bgLight} ${styles.rounded3} ${styles.textCenter}`}>
                    <div className={`${styles.m4} ${styles.mLg5}`}>
                        <h1 className={`${styles.display5} ${styles.fwBold}`}>A warm welcome!</h1>
                        <p className={styles.fs4}>Bootstrap utility classes are used to create this jumbotron since the old component has been removed from the framework. Why create custom CSS when you can use utilities?</p>
                        <Link className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} to="#!">Call to action</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;