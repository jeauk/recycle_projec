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
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [steps, setSteps] = useState([]);

  const myBackDomain = "http://trashformer.site:8080";
  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  // 서버에서 데이터를 불러오는 함수
  const dataget = async () => {
    if (!id) return;
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
      setSteps(data.post.steps || []);
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("videoLink", videoLink);

    // 메인 이미지가 있으면 추가
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    // 스텝 정보 추가
    steps.forEach((step, index) => {
      formData.append(`steps[${index}].stepContent`, step.stepContent);
      if (step.imgFile) {
        formData.append(`steps[${index}].stepImage`, step.imgFile);
      }
    });

    try {
      const response = await fetch(`${myBackDomain}/edit/posts/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('게시물 저장 중 오류 발생');
      }

      alert(`게시물이 성공적으로 ${id ? '수정' : '작성'}되었습니다.`);
      navigate(id ? `/post/${id}` : '/list');
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

  // 스텝 이미지 변경 핸들러
  const handleStepImageChange = (index, file) => {
    const updatedSteps = [...steps];
    updatedSteps[index].imgFile = file; // 이미지 파일을 스텝에 추가
    updatedSteps[index].imgUrl = URL.createObjectURL(file); // 미리보기 URL 생성
    setSteps(updatedSteps);
  };

  // 메인 이미지 변경 핸들러
  const handleImageChange = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    dataget();
  }, [id]);

  useEffect(() => {
    if (isValidVideoUrl(videoLink)) {
      const thumbnail = generateThumbnailUrl(videoLink);
      setThumbnailUrl(thumbnail);
    } else {
      setThumbnailUrl('');
    }
  }, [videoLink]);

  // 폼 렌더링
  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>{id ? '게시물 수정' : '새 게시물 작성'}</h1>
      <div className={styles.mainContent}>
        <div className={styles.imageUpload}>
          <div
            className={styles.imagePlaceholder}
            style={{ width: '500px', height: '300px' }}
            onClick={() => document.getElementById('imageUploadInput').click()}
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
            onChange={(e) => handleImageChange(e.target.files[0])}
            className={styles.inputField}
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.inputFields}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.inputField}
          />

          <label className={styles.label}>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.contentInput}
          ></textarea>
        </div>
      </div>

      <div className={styles.videoLinkContainer}>
        <div className={styles.videoLinkFields}>
          <label className={styles.label}>동영상 링크 (유튜브 등)</label>
          <input
            type="url"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="링크가 없을 경우 칸을 비워주세요."
            className={styles.inputField}
          />
        </div>
        <div className={styles.thumbnailBox}>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Video Thumbnail" className={styles.thumbnailImage} />
          )}
        </div>
      </div>

      <div className={styles.stepsContainer}>
        <h2>Steps</h2>
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <div key={index} className={styles.stepContainer}>
              <div className={styles.stepContent}>
                <label className={styles.label}>STEP {index + 1}</label>
                <textarea
                  value={step.stepContent}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className={styles.textareaField}
                ></textarea>
              </div>
              <div
                className={styles.stepImageUpload}
                onClick={() => document.getElementById(`stepImageUploadInput${index}`).click()}
              >
                {step.imgUrl ? (
                  <img src={step.imgUrl} alt={`STEP ${index + 1} 미리보기`} className={styles.imagePreview} />
                ) : (
                  <div className={styles.imagePlaceholder}>STEP 이미지가 없습니다.</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                id={`stepImageUploadInput${index}`}
                onChange={(e) => handleStepImageChange(index, e.target.files[0])}
                className={styles.inputField}
                style={{ display: 'none' }}
              />
            </div>
          ))
        ) : (
          <p>스텝 정보가 없습니다.</p>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>{id ? '수정하기' : '작성하기'}</button>
      <button type="button" className={styles.cancelButton} onClick={() => navigate('/list')}>취소</button>
    </form>
  );
};

export default PostEdit;
