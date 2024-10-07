import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/PostDetail.module.css'; // CSS 모듈 임포트

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [recommendCount, setRecommendCount] = useState(0);
  const myBackDomain = "https://trashformer.site";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const jwt = sessionStorage.getItem('jwt');
        const response = await fetch(myBackDomain + `/api/posts/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('게시물을 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setPost(data.post);
        setIsAuthor(data.isAuthor);
        setRecommendCount(data.post.recommendCount);
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
    const url = myBackDomain + `/delete/posts/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${jwt}` }
    });
    navigate(`/`);
  };

  const handleRecommend = async () => {
    const jwt = sessionStorage.getItem('jwt');

    if (!jwt) {
      alert("로그인해야 추천할 수 있습니다.");
      return;
    }

    const url = myBackDomain + `/api/posts/recommend/${id}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({})
    });

    if (response.ok) {
      const postResponse = await fetch(myBackDomain + `/api/posts/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });

      if (postResponse.ok) {
        const updatedData = await postResponse.json();
        setPost(updatedData.post);
        setRecommendCount(updatedData.post.recommendCount);
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

    if (videoLink.includes("youtu.be")) {
      const links = videoLink.split("/");
      const videoId = links[links.length - 1].split('?')[0];
      embedUrl = `http://www.youtube.com/embed/${videoId}`;
    } else if (videoLink.includes("youtube.com/watch")) {
      const params = new URLSearchParams(new URL(videoLink).search);
      const videoId = params.get("v");
      embedUrl = `http://www.youtube.com/embed/${videoId}`;
    } else if (videoLink.includes("tv.naver.com/v/")) {
      const videoId = videoLink.split("/v/")[1];
      embedUrl = `https://tv.naver.com/embed/${videoId}`;
    }

    return embedUrl;
  };

  return (
    <div className={styles.bigbigcontainer}>
      {/* 첫 번째 섹션 */}
      <div className={styles.section}>
        <div className={styles.mainImageContainer}>
          {/* 메인 이미지 */}
          <img className={styles.mainImage} src={post.imagePath ? post.imagePath.replace(/\\/g, "/") : ''} alt="완성 사진" />

          {/* 프로필 및 정보 오버레이 */}
          <div className={styles.overlayContainer}>
            <img className={styles.profileImage} src={post.kakaoUserEntity.profileImageUrl} alt="프로필 이미지" />
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>{post.kakaoUserEntity.nickname}</span>
            </div>
          </div>

          {/* 조회수 표시 */}
          <div className={styles.recommendCount}>
            <span onClick={handleRecommend}>👍{post.recommendCount}</span>
          </div>
          <div>
            <span>{post.updateChange ? `${post.createdAt}(수정됨)` : post.createdAt}</span>
          </div>
          <div className={styles.mainTitle}>
            <h2>{post.title}</h2>
          </div>
        </div>
      </div>

      {/* 두 번째 섹션 */}
      <div className={styles.section}>
        <h2>내용 (재료)</h2>
        <p className={styles.contentMargin}>{post.content}</p>

        {/* 동영상 섹션 */}
        {post.videoLink && (
          <div>
            <h2>동영상 링크</h2>
            <p className={styles.videoLink}>
              <iframe width="420" height="315" src={createEmbedUrl(post.videoLink)} />
            </p>
          </div>
        )}
      </div>

      {/* 세 번째 섹션 (스탭 설명) */}
      <div className={styles.section}>
        <h2>스탭별 설명</h2>
        {post.steps.map((step, index) => (
          <div key={index} className={styles.stepsContainer}>
            {step.imgUrl && <img src={step.imgUrl.replace(/\\/g, "/")} alt={`스탭 ${step.step} 이미지`} className={styles.stepsImage} />}
            <div className={styles.stepsText}>
              <h3>스탭 {index + 1}</h3>
              <p>{step.stepContent}</p>
            </div>
          </div>
        ))}

      </div>

      {/* 추천 및 수정, 삭제 버튼 */}
      <button className={styles.button} onClick={handleRecommend}>
        추천 {recommendCount}
      </button>
      {isAuthor && (
        <div className={styles.editele}>
          <button className={styles.button} onClick={handleEdit}>수정</button>
          <button className={styles.button} onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
