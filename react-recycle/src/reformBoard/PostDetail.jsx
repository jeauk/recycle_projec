import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams(); // URL에서 게시물 ID를 가져옴
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [recommendCount, setRecommendCount] = useState(0); // 추천수 상태 추가

  useEffect(() => {
    // 서버에서 게시물 데이터를 가져옴
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
        setPost(data.post); // 게시물 데이터 설정
        setIsAuthor(data.isAuthor); // 작성자인지 여부 설정
        setRecommendCount(data.post.recommendCount); // 추천수 설정
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    const jwt = sessionStorage.getItem('jwt');
    const url = `http://localhost:8080/delete/posts/${id}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {'Authorization': `Bearer ${jwt}`}
    });
    console.log('삭제됨');
    navigate(`/`);
  };
  const handleRecommend = async () => {
    const jwt = sessionStorage.getItem('jwt');
  
    // 로그인 여부 확인
    if (!jwt) {
      alert("로그인해야 추천할 수 있습니다.");
      return;
    }
  
    const url = `http://localhost:8080/api/posts/recommend/${id}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({})  // 빈 객체를 보냅니다.
    });
  
    if (response.ok) {
      // 추천 상태가 변경되었음을 알림
  
      // 서버에서 최신 게시물 데이터를 다시 가져옴
      const postResponse = await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`, // JWT 토큰을 Authorization 헤더에 추가
          'Content-Type': 'application/json'
        }
      });
  
      if (postResponse.ok) {
        const updatedData = await postResponse.json();
        setPost(updatedData.post); // 게시물 데이터 업데이트
        setRecommendCount(updatedData.post.recommendCount); // 추천수 업데이트
      } else {
        alert('최신 게시물 정보를 가져오는 데 실패했습니다.');
      }
    } else {
      alert('추천 처리에 실패했습니다.');
    }
  };
  

  if (!post) return <div>로딩 중...</div>;

  const createEmbedUrl = (videoLink) => {
    let embedUrl = null;

    // 유튜브 "youtu.be" 형식
    if (videoLink.includes("youtu.be")) {
      const links = videoLink.split("/");
      const videoId = links[links.length - 1].split('?')[0];
      embedUrl = `http://www.youtube.com/embed/${videoId}`;
    }
    // 유튜브 "youtube.com/watch" 형식
    else if (videoLink.includes("youtube.com/watch")) {
      const params = new URLSearchParams(new URL(videoLink).search);
      const videoId = params.get("v");
      embedUrl = `http://www.youtube.com/embed/${videoId}`;
    }
    // 네이버 TV 형식
    else if (videoLink.includes("tv.naver.com/v/")) {
      const videoId = videoLink.split("/v/")[1];
      embedUrl = `https://tv.naver.com/embed/${videoId}`;
    }

    return embedUrl; // 유효하지 않은 링크일 경우 null 반환
  };

  return (
    <div>
      <img src={post.imagePath ? post.imagePath.replace(/\\/g, "/") : ''} alt="완성 사진" style={{ width: '100%', height: 'auto' }} />
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
      <p><iframe width="420" height="315" src={createEmbedUrl(post.videoLink)} /></p>
      <hr />
      <h2>스탭</h2>
      {post.steps.map((step, index) => (
        <div key={index}>
          <h3>스탭 {index + 1}</h3>
          <p>{step.stepContent}</p>
          {step.imgUrl && <img src={step.imgUrl.replace(/\\/g, "/")} alt={`스탭 ${step.step} 이미지`} style={{ width: '100%', height: 'auto' }} />}
        </div>
      ))}
      <hr />
      <button onClick={handleRecommend}>
        추천 {recommendCount}
      </button>
      {isAuthor && (  // 작성자인 경우에만 수정 및 삭제 버튼을 렌더링
        <div>
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
}

export default PostDetail;