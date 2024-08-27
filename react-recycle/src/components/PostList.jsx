import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);  // 게시글 데이터를 저장할 상태
  const navigate = useNavigate(); // ++++ 훅

  useEffect(() => {
    // 백엔드에서 데이터 가져오기
    fetch('http://localhost:8080/list')
      .then(response => response.json())  // 응답을 JSON 형식으로 변환
      .then(data => {
        setPosts(data);  // 상태에 데이터 저장
      })
      .catch(error => {
        console.error("데이터를 가져오는 데 실패했습니다.", error);
      });
  }, []);  // 빈 배열로 첫 렌더링 시에만 실행

  const handleCreatePost = () => {
    navigate('/post'); // ++훅 넣은거
  };

  return (
    <div>
      <h1>게시글 목록</h1>
      <button onClick={handleCreatePost}>작성하기</button>
      <button onClick={() => {
            navigate('/sido');
          }}>시도테스트</button>
      <ul>
        {posts.length > 0 ? (
          posts.map(post => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`}>
              <h2>{post.title}</h2>
              </Link>
              <p>{post.content}</p>
            </li>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default PostList;