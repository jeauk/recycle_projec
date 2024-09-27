import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './PostForm.module.css';

// 유튜브 썸네일 생성 함수
const generateThumbnailUrl = (url) => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[1]) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/0.jpg`;
  }
  return '';
};

// 유효한 비디오 링크 확인 함수
const isValidVideoUrl = (url) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const PostEdit = () => {
  const { id } = useParams(); // URL에서 ID 가져오기 (수정 시 사용)
  const [post, setPost] = useState(null); // 서버에서 받아온 게시물 데이터
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // 썸네일 URL 상태 추가
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null); // 대표 이미지 파일 상태
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기 URL
  const [videoLink, setVideoLink] = useState("");
  const [steps, setSteps] = useState([]); // 스텝 데이터 저장

  const myBackDomain = "http://trashformer.site:8080";
  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  // 서버에서 데이터를 불러오는 함수 (게시물 수정 시 사용)
  const dataget = async () => {
    if (!id) return; // ID가 없으면 새 게시물 작성이므로 데이터 불러오지 않음
    try {
      const response = await fetch(`${myBackDomain}/edit/posts/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${jwt}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post data');
      }

      const data = await response.json();
      setPost(data.post);
      setTitle(data.post.title);
      setContent(data.post.content);
      setImagePreview(data.post.imagePath);
      setVideoLink(data.post.videoLink);
      setSteps(data.post.steps || []); // 스텝 데이터가 없을 경우 기본값으로 빈 배열 설정
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터를 불러옴
  useEffect(() => {
    dataget();
  }, [id]);

  // videoLink가 변경될 때마다 썸네일 자동 생성
  useEffect(() => {
    if (isValidVideoUrl(videoLink)) {
      const thumbnail = generateThumbnailUrl(videoLink);
      setThumbnailUrl(thumbnail);
    } else {
      setThumbnailUrl(''); // 유효하지 않은 링크일 경우 썸네일 비우기
    }
  }, [videoLink]);

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("videoLink", videoLink);
    
    // 대표 이미지 파일 추가
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    steps.forEach((step, index) => {
      formData.append(`steps[${index}].stepContent`, step.stepContent);
      
      // 각 스텝의 이미지 파일 추가
      if (step.imageFile) {
        formData.append(`steps[${index}].stepImage`, step.imageFile);
      }
    });

    try {
      const response = await fetch(`${myBackDomain}/edit/posts/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${jwt}` },
        body: formData
      });

      if (!response.ok) {
        throw new Error('게시물 저장 중 오류 발생');
      }

      alert(`게시물이 성공적으로 ${id ? '수정' : '작성'}되었습니다.`);
      navigate(id ? `/post/${id}` : '/list'); // 수정 후 해당 게시물로 이동, 작성 후 목록으로 이동
    } catch (error) {
      console.error('게시물 저장 중 오류 발생:', error);
    }
  };

  // 스텝 내용 변경 핸들러
  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].stepContent = value;
    setSteps(updatedSteps);
  };

  // 폼 렌더링
  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>{id ? '게시물 수정' : '새 게시물 작성'}</h1>
      <div className={styles.mainContent}>
        <div className={styles.imageUpload}>
          <div
            className={styles.imagePlaceholder}
            style={{ width: '500px', height: '300px' }}
            onClick={() => document.getElementById('imageUploadInput').click()} // 클릭 시 input 필드 클릭 트리거
          >
            {imagePreview ? (
              <img src={imagePreview} alt="미리보기" className={styles.imagePreview} />
            ) : (
              <div>대표 이미지가 없습니다.</div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            id="imageUploadInput"
            onChange={(e) => {
              const file = e.target.files[0];
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }}
            className={styles.inputField}
            style={{ display: 'none' }}
          />
        </div>

        {/* 나머지 폼 필드와 스텝 이미지 업로드 등 기존 코드와 동일 */}
        {/* ... */}

        <button type="submit" className={styles.submitButton}>{id ? '수정하기' : '작성하기'}</button>
        <button type="button" className={styles.cancelButton} onClick={() => navigate('/list')}>취소</button>
      </div>
    </form>
  );
};

export default PostEdit;
