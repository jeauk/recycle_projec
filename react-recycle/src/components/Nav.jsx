import { Link } from "react-router-dom";
import styles from '../styles/Nav.module.css';

const Nav = () => {
    return (
        <nav className={`${styles.navbar} navbar-expand-lg navbar-dark ${styles.bgDark}`}>
            <div className={`${styles.container} px-lg-5`}>
                <Link className="navbar-brand lsga" to="#!">Start Bootstrap</Link>
                <button className="lsgnavbar-toggler lsgbutton" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className={styles.navbarTogglerIcon} />
                </button>
                <div className={`collapse lsgnavbar-collapse`} id="navbarSupportedContent">
                    <ul className={`navbar-nav ms-auto mb-2 mb-lg-0 ${styles.lsgul}`}>
                        <li className={`nav-item`}><Link className={`nav-link active`} aria-current="page" to="#!">Home</Link></li>
                        <li className={`nav-item`}><Link className={`nav-link`} to="#!">About</Link></li>
                        <li className={`nav-item`}><Link className={`nav-link`} to="#!">Contact</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;