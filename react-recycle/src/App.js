import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import LoginHandeler from './components/LoginHandeler';
import Kakaobtn from './components/KakaoBtn';


function App() {
  return (
    <Router>
      <div className="App">
        <Kakaobtn />
        <h1>게시글</h1>
      <PostForm  />
      <PostList />
        <Routes>
          <Route
            path="/login/oauth2/callback/kakao" // redirect_url
            element={<LoginHandeler />} // 당신이 redirect_url에 맞춰 꾸밀 컴포넌트
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;