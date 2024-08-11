import { Link } from 'react-router-dom';
import '../styles/main.css';
import '../styles/reset.css';
import '../styles/read.css';

const Header = () => {
  return (
      <header id="header">
          <div id="headerIn">
              <h1 className="logo">
                  <Link to="#"><img src="/img/logo.jpg" alt="멍냥토크" /></Link>
              </h1>
              <div className="search">
                  <input type="text" className="src" />
                  <label>검색하기</label>
                  <select className="h_category">
                    <option>전체</option>
                    <option>멍톡</option>
                    <option>냥톡</option>
                    <option>잡담</option>
                    <option>헬프</option>
                  </select>
                  <Link to="#" className="srcimg">
                      <img src="/img/srcimg.jpg" alt="검색" />
                  </Link>
              </div>
          </div>
      </header>
  );
};

export default Header;
