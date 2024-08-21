import React, { useEffect, useState } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);  // 게시글 데이터를 저장할 상태

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


  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
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