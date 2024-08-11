import { Link } from "react-router-dom";
import '../styles/main.css';
import '../styles/reset.css';
import '../styles/read.css';

const Nav = () => {
    return (
      <nav id="lnb">
      <ul className="cf">
        <li><Link to="#">전체</Link></li>
        <li><Link to="#">멍톡</Link></li>
        <li><Link to="#">냥톡</Link></li>
        <li><Link to="#">잡담</Link></li>
        <li><Link to="#">헬프</Link></li>
      </ul>
    </nav>
    );
  };
  
  export default Nav;