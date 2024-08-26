import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostEdit from './components/PostEdit';
import LoginHandeler from './components/LoginHandeler';
import Kakaobtn from './components/KakaoBtn';
import Logout from './components/Logout';
import MyPage from './components/MyPage'; //추가

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
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <Logout onLogout={handleLogout} />
        ) : (
          <Kakaobtn onLogin={handleLogin} />
        )}
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post" element={<PostForm />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/edit/:id" element={<PostEdit />} />
          <Route path="/mypage" element={<MyPage />} /> //추가
          <Route
            path="/login/oauth2/callback/kakao"
            element={<LoginHandeler onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
