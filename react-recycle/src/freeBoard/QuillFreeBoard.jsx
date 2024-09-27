import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/QuillFreeBoard.module.css';

const QuillFreeBoard = () => {
  const [posts, setPosts] = useState([]);
  const myBackDomain = "http://localhost:8080";
  const navigate = useNavigate();

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      const url = `${myBackDomain}/freeBoard/posts`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('게시글 목록을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    };

    fetchPosts();
  }, []);

  // 게시글 제목 클릭 핸들러
  const handlePostClick = (postId) => {
    navigate(`/QuillFreeBoard/post/${postId}`);
  };

  // 글쓰기 버튼 클릭 핸들러
  const handleCreatePostClick = () => {
    navigate('/QuillFreeBoard/Create');
  };

  return (
    <div className={styles.container}>
      <h2>게시판</h2>
      <ul className={styles.postList}>
        {posts.map((post) => (
          <li key={post.id} className={styles.postItem}>
            <h3 className={styles.postTitle} onClick={() => handlePostClick(post.id)}>
              {post.title}
            </h3>
            {post.imageUrl && (
              <img src={`http://localhost:8080${post.imageUrl}`} alt="게시물 이미지" className={styles.postImage} />
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleCreatePostClick} className={styles.createPostButton}>
        글쓰기
      </button>
    </div>
  );
};

export default QuillFreeBoard;
