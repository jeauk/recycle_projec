import { Link } from "react-router-dom";
import style from '../styles/Kategorie.module.css'

const Kategorie = () => {
    return (
        <div id={style.wrap}>
            <nav id={style.lnb}>
                <ul class={style.cf}>
                    <li><Link to="#">전체</Link></li>
                    <li><Link to="/free">자유게시판</Link></li>
                    <li><Link to="/chat">잡담</Link></li>
                    <li><Link to="/catdog">멍냥</Link></li>
                    <li><Link to="/help">문의</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Kategorie;