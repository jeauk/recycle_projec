import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import LoginHandeler from './components/LoginHandeler';
import Kakaobtn from './components/KakaoBtn';


function App() {
  return (
    <Router>
      <div className="App">
        <Kakaobtn />
        <Routes>
          <Route path="/post" element={<PostForm />} />
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route
            path="/login/oauth2/callback/kakao"
            element={<LoginHandeler />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;