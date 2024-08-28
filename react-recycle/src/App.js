import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Footer from './components/Footer';
import KakaoMap from './components/KakaoMap';
import TopHeader from './components/TopHeader';
import styles from './App.module.css';
import React, { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostEdit from './components/PostEdit';
import LoginHandeler from './components/LoginHandeler';
import Kakaobtn from './components/KakaoBtn';
import Logout from './components/Logout';
import Sido from './components/Sido';
import ReMap from './components/ReMap';

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
              <Route path="/login" element={<PostList />} />
              <Route path="/post" element={<PostForm />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/edit/:id" element={<PostEdit />} />
              <Route
                path="/login/oauth2/callback/kakao"
                element={<LoginHandeler onLogin={handleLogin} />}
              />
              <Route path="/sido" element={<Sido />} />
              <Route path="/remap" element={<ReMap />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
