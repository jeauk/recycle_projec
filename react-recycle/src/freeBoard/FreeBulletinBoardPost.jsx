import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/QuillFreeBoard.module.css'; // 스타일 모듈 import

const QuillFreeBoardPost = () => {
  const { id } = useParams(); // URL에서 게시물 ID 가져오기
  const [post, setPost] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/freeBoard/post/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error('게시물 불러오기 실패');
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleBack = () => {
    navigate('/quillfreeBoard'); // 게시판으로 돌아가기
  };

  if (!post) {
    return <div>로딩 중...</div>; // 데이터 로딩 중 표시
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{post.title}</h2>
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      <div className={styles.info}>
        <p>작성자: {post.nickname}</p>
        <p>작성일: {new Date(post.createdAt).toLocaleString()}</p>
      </div>
      <button onClick={handleBack} className={styles.backButton}>
        돌아가기
      </button>
    </div>
  );
};

export default QuillFreeBoardPost;
