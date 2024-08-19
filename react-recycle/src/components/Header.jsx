import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header id="header">
            <div id="headerIn">
                <h1 className="logo">
                    <Link to="/">
                        <img src="img/logo.jpg" alt="멍냥토크" />
                    </Link>
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
                    <Link to="/search" className="srcimg">
                        <img src="img/srcimg.jpg" alt="검색" />
                    </Link>
                </div>
                <div class="login ut">
                    <Link to="mypage">
                        <img src="img/user.svg" class="profileimg" />
                        <span class="username">
                            <strong>이름</strong>
                        </span>
                    </Link>
                    <span class="user2"> 님, 환영합니다.</span>
                </div>
                <div>
                    <Link to="/login" class="logout">로그인</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;