import React, { useEffect, useState } from 'react';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
      id: Date.now(), // 임시 ID
      views: 0,
      recommendCount: 0
    };

    // 데이터를 JSON 형식으로 백엔드에 POST 요청으로 전송
    fetch('http://localhost:8080/post', {  // 여기에 실제 백엔드 API URL을 입력하세요.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(data => {
      console.log('성공:', data);
    })
    .catch((error) => {
      console.error('에러:', error);
    });

    setTitle('');
    setContent('');
  };

  useEffect(()=>{
  },[])

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
      <button type="submit">작성하기</button>
    </form>
  );
}

export default PostForm;
