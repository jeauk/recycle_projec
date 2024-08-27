import { Link } from "react-router-dom";
import s from '../styles/TopHeader.module.css';

const TopHeader = () => {
    return (
        <header className={s.header}>
            <Link className={s.headerContainer}  to="/">
                <div className={s.headerText}>
                    TrashFormer
                </div>
            </Link>
            <Link className={s.loginContainer} to="/login">
                <button className={s.loginButton}>
                    Login
                </button>
            </Link>
        </header>
    );
};

export default TopHeader;