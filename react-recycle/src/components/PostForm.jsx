import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState(''); // 사용자 닉네임 상태
  const [email, setEmail] = useState(''); // 사용자 이메일 상태
  const navigate = useNavigate();



  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      kakaoUserEntity: {
        email,
        nickname
      },
      title,
      content
    };

    // 데이터를 JSON 형식으로 백엔드에 POST 요청으로 전송
    fetch('http://localhost:8080/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(data => {
      console.log('성공:', data);
      navigate('/');
    })
    .catch((error) => {
      console.error('에러:', error);
    });

    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">올리기</button>
    </form>
  );
}

export default PostForm;
