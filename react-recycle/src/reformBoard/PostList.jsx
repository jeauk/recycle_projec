import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글 목록을 가져오는 API 호출
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/postlist");
        if (!response.ok) {
          throw new Error("게시글을 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = () => {
    navigate("/post");
  };

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div>
      <h1>게시글 목록</h1>
      <button onClick={handleCreatePost}>작성하기</button>
      <button onClick={() => {
            navigate('/sido');
          }}>시도테스트</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id} onClick={() => handlePostClick(post.id)}>
            <strong>제목:</strong> {post.title} <br />
            <strong>작성자:</strong> {post.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
