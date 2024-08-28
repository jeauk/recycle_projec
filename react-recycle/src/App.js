import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import Nav from "./components/Nav";
import Logout from "./myPage/Logout";
import Kakaobtn from "./myPage/KakaoBtn";
import Home from "./mainPage/Home";
import KakaoMap from "./vendingDevice/KakaoMap";
import PostList from "./reformBoard/PostList";
import PostForm from "./reformBoard/PostForm";
import PostDetail from "./reformBoard/PostDetail";
import PostEdit from "./reformBoard/PostEdit";
import Footer from "./components/Footer";
import styles from './App.module.css';
import LoginHandeler from './myPage/LoginHandeler';
import Sido from './market/Sido';
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태를 확인
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 상태를 true로 변경
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 상태를 false로 변경
    sessionStorage.removeItem("jwt"); // JWT 삭제
  };

  return (
    <div className="App">
      <div className={styles.appContainer}>
        <BrowserRouter>
          <TopHeader />
          <Nav />
          <div className={styles.mainContent}>
          {isLoggedIn ? (
              <Logout onLogout={handleLogout} />
            ) : (
              <Kakaobtn onLogin={handleLogin} />
            )}
            <Routes>
              <Route index element={<Home />} />
              <Route path='/map' element={<KakaoMap />} />
              <Route path="/" element={<PostList />} />
              <Route path="/post" element={<PostForm />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/edit/:id" element={<PostEdit />} />
              <Route
                path="/login/oauth2/callback/kakao"
                element={<LoginHandeler onLogin={handleLogin} />}
              />
              <Route path="/sido" element={<Sido />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
