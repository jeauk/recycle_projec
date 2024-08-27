import { Link } from "react-router-dom";
import styles from '../styles/TopHeader.module.css';

const TopHeader = () => {
    return (
        <topheader className={styles.py5}>
            <div className={styles.container}>
                <Link className={styles.textCenter} to="/">
                    TrashFormer
                </Link>
            </div>
        </topheader>
    );
};

export default TopHeader;