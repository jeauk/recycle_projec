import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/QuillFreeBoard.module.css'; // 모듈 CSS import

const QuillFreeBoardPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const myBackDomain = "http://localhost:8080";

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      const url = `${myBackDomain}/freeBoard/post/${id}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(data); // 데이터 로그 확인
          setPost(data);
        } else {
          console.error('게시글을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>로딩 중...</div>; // 데이터 로딩 중 메시지
  }

  return (
    <div className={styles.container}>
      <h2>{post.title}</h2>
      <p><strong>작성자:</strong> {post.nickname}</p>
      <p><strong>작성일:</strong> {new Date(post.createdAt).toLocaleString()}</p>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
      {post.imageUrl && (
        <div className={styles.imageContainer}>
          <img src={`http://localhost:8080${post.imageUrl}`} alt="게시글 이미지" className={styles.image} />
        </div>
      )}
    </div>
  );
};

export default QuillFreeBoardPost;
