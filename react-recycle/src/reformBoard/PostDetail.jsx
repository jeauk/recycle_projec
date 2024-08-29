import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams(); // URL에서 게시물 ID를 가져옴
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    // 서버에서 게시물 데이터를 가져옴 (가상의 API 호출)
    const fetchPost = async () => {
      try {
        const jwt = sessionStorage.getItem('jwt'); // 세션에서 JWT 토큰을 가져옴

        const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`, // JWT 토큰을 Authorization 헤더에 추가
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('게시물을 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setPost(data);

        // 현재 사용자가 작성자인지 확인
        const userEmail = extractEmailFromJwt(jwt); // JWT에서 사용자 이메일을 추출
        setIsAuthor(data.authorEmail === userEmail); // 작성자와 현재 사용자를 비교
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchPost();
  }, [id]);

  // JWT 토큰에서 이메일을 추출하는 가정된 함수
  const extractEmailFromJwt = (jwt) => {
    // JWT 토큰을 파싱하여 이메일을 추출하는 로직을 여기에 구현
    return 'example@example.com'; // 가정된 이메일 반환
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = () => {
    // 삭제 로직 구현 (가상의 API 호출)
    // 이후 삭제 후 목록으로 이동
    navigate('/');
  };

  const handleRecommend = () => {
    // 추천하기 로직 구현 (가상의 API 호출)
    alert('추천이 반영되었습니다!');
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <div>
      <img src={post.imagePath} alt="완성 사진" style={{ width: '100%', height: 'auto' }} />
      <h1>{post.title}</h1>
      <p>
        작성자: {post.kakaoUserEntity.nickname} &nbsp;&nbsp;&nbsp; 
        작성날짜: {post.modifiedAt ? `${post.modifiedAt} (수정됨)` : post.createdAt} &nbsp;&nbsp;&nbsp; 
        조회수: {post.viewCount}
      </p>
      <hr />
      <h2>내용 (재료)</h2>
      <p>{post.content}</p>
      <hr />
      <h2>동영상 링크</h2>
      <p><a href={post.videoLink} target="_blank" rel="noopener noreferrer"></a></p>
      <hr />
      <h2>스탭</h2>
      {post.steps.map((step, index) => (
        <div key={index}>
          <h3>스탭 {index + 1}</h3>
          <p>{step.content}</p>
          {step.imagePath && <img src={step.imagePath} alt={`스탭 ${index + 1} 이미지`} style={{ width: '100%', height: 'auto' }} />}
        </div>
      ))}
      <hr />
      <button onClick={handleRecommend}>
        추천하기 {post.recommendCount}
      </button>
      {isAuthor && (
        <div>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
