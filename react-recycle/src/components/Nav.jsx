import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <nav id="lnb">
            <ul class="cf">
                <li><Link to="/pool">전체</Link></li>
                <li><Link to="/dog">멍톡</Link></li>
                <li><Link to="/cat">냥톡</Link></li>
                <li><Link to="/cool">잡담</Link></li>
                <li><Link to="/help">헬프</Link></li>
            </ul>
        </nav>
    );
};

export default Nav;