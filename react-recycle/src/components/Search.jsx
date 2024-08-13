import { Link } from "react-router-dom";
import styles from '../styles/Search.module.css'


const Search = () => {
    return (
        <div id={styles.wrap}>
            <header id={styles.header}>
                <div id={styles.headerIn}>
                    <div className={styles.search}>
                        <input type="text" className={styles.src} />
                        <label>검색하기</label>
                        <select className={styles.h_category}>
                            {/* 드롭다운 */}
                            <option>전체</option>
                            <option>멍톡</option>
                            <option>냥톡</option>
                            <option>잡담</option>
                            <option>헬프</option>
                        </select>
                        <Link to="#" className={styles.srcimg}>
                            <img src="/img/srcimg.jpg" alt="검색" />
                        </Link>
                    </div>
                </div>
            </header>
        </div>

    );
};

export default Search;