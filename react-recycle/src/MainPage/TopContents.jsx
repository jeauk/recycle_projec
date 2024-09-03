import { Link } from 'react-router-dom';
import st from '../styles/TopContents.module.css';

const TopContents = () => {
    return (
        <header className={st.c1}>
            <div className={st.c2}>
                <div className={st.c3}>
                    <div className={st.c4}>
                        <h1 className={st.h1}>hell</h1>
                        <p className={st.p1}>hello</p>
                        <Link className={st.lk} to="#">sdsd</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopContents;