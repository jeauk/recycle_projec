import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './PostForm.module.css';

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 메인 이미지 미리보기
  const [videoLink, setVideoLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // 썸네일 URL 상태 추가
  const [steps, setSteps] = useState([{ id: 1, content: "", image: null, imagePreview: null }]); // id와 미리보기 추가
  const [errorMessage, setErrorMessage] = useState('');
  const [nextId, setNextId] = useState(2); 
  const [titleplaceholder, setTitlePlaceholder] = useState('옷걸이로 선반 만들기');
  const [contentPlaceholder, setContentPlaceholder] = useState('쇠 옷걸이, 니퍼(펜치)')
  

  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  const mainImageInputRef = useRef(null); // 메인 이미지 입력 Ref
  const stepImageInputRefs = useRef([]);  // Step 이미지 입력 Ref 배열

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // 메인 이미지 미리보기 설정
  };

  const handleImageClick = () => {
    mainImageInputRef.current.click();  // 이미지 클릭 시 파일 선택 창 열기
  };

  // Step별 데이터 변경 핸들러
  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    if (field === "image") {
      newSteps[index].image = value;
      newSteps[index].imagePreview = URL.createObjectURL(value); // 스텝 이미지 미리보기 설정
    } else {
      newSteps[index][field] = value;
    }
    setSteps(newSteps);
  };

  const handleStepImageClick = (index) => {
    stepImageInputRefs.current[index].click(); // 각 스텝의 이미지 클릭 시 파일 선택 창 열기
  };

  // Step 추가 핸들러
  const handleAddStep = () => {
    setSteps([...steps, { id: nextId, content: "", image: null, imagePreview: null }]); // 새로운 step에 id와 미리보기 추가
    setNextId(nextId + 1);
  };

  const handleRemoveStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    formData.append("videoLink", videoLink);

    steps.forEach((step, index) => {
      formData.append(`steps[${index}][content]`, step.content); 
      if (step.image) {
        formData.append(`steps[${index}][image]`, step.image); // 문자열
      }
    });

    try {
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
        },
        body: formData,
      });

      const textResponse = await response.text();
      console.log("서버 응답 (텍스트):", textResponse);

      if (!response.ok) {
        throw new Error(`게시물을 업로드하는 데 실패했습니다. 상태 코드: ${response.status}`);
      }

      const result = JSON.parse(textResponse);
      alert("게시물이 성공적으로 업로드되었습니다!");
      navigate('/');
    } catch (error) {
      console.error("에러 발생:", error);
      alert(`게시물 업로드 중 문제가 발생했습니다: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
  
    if (!value.includes('youtube.com') && !value.includes('youtu.be') && !value.includes('tv.naver.com') && !value.includes('naver.me')) {
      setErrorMessage('유튜브나 네이버링크로 작성해주세요.'); // 경고 메시지 설정
    } else {
      setErrorMessage(''); // 오류 메시지 초기화
      setThumbnailUrl(generateThumbnailUrl(value)); // 썸네일 URL 업데이트
    }
  
    setVideoLink(value);
  };
  

  //썸네일
  const generateThumbnailUrl = (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const naverRegex = /tv\.naver\.com\/v\/(\d+)/; // 네이버 TV 링크에서 고유한 비디오 ID 추출
  
    const youtubeMatch = url.match(youtubeRegex);
    const naverMatch = url.match(naverRegex);
  
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/0.jpg`;
    } else if (naverMatch && naverMatch[1]) {
      return 
    }
  
    return '';
  };

  const handleTitleFocus = () => {
    setTitlePlaceholder(''); // 포커스 시 placeholder를 지움
  };

  const handleContentFocus = ()=>{
    setContentPlaceholder('');
  };

return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.mainContent}>
        <div className={styles.imageUpload} onClick={handleImageClick}>
          {imagePreview ? (
            <img src={imagePreview} alt="미리보기" className={styles.imagePreview} />
          ) : (
            <div className={styles.imagePlaceholder}>여기에 이미지 첨부 (대표 완성 사진)</div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={mainImageInputRef} // useRef를 사용하여 참조
            style={{ display: 'none' }}  // 숨김 처리
            onChange={handleImageChange}
          />
        </div>
        <div className={styles.inputFields}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            value={title}
            placeholder={titleplaceholder}
            onFocus={handleTitleFocus}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.inputField}
          />
          <label className={styles.label}>재료</label>
          <input
          type = "text"
            value={content}
            placeholder={contentPlaceholder}
            onFocus={handleContentFocus}
            onChange={(e) => setContent(e.target.value)}
            required
            className={styles.contentInput}
          />
          </div>
          </div>

          <div className={styles.videoLinkContainer}>
          <div className={styles.videoLinkFields}>
          <label className={styles.label}>동영상 링크 (유튜브 등)</label>
          <input
            type="url"
            value={videoLink}
            onChange={handleChange}  // 동영상 링크 입력 시 handleChange 실행
            placeholder="링크가 없을 경우 칸을 비워주세요."
            style={{ borderColor: errorMessage ? 'red' : '' }}
            className={styles.inputField}
          />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        {/* 썸네일 미리보기 박스 */}
        <div className={styles.thumbnailBox}>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Video Thumbnail" className={styles.thumbnailImage} />
          )}
        </div>
      </div>

      <div className={styles.stepsContainer}>
      {steps.map((step, index) => (
        <div key={step.id} className={styles.stepContainer}> {/* 고유한 id를 key로 사용 */}
          <div className={styles.stepContent}>
            <label className={styles.label}>STEP {index + 1}</label>
            <textarea
              value={step.content}
              onChange={(e) =>
                handleStepChange(index, "content", e.target.value)
              }
              required
              className={styles.textareaField}
            ></textarea>
          </div>
          <div className={styles.stepImageUpload} onClick={() => handleStepImageClick(index)}>
            {step.imagePreview ? (
              <img src={step.imagePreview} alt={`STEP ${index + 1} 미리보기`} className={styles.imagePreview} />
            ) : (
              <div className={styles.imagePlaceholder}>여기에 STEP 이미지 첨부</div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={(el) => (stepImageInputRefs.current[index] = el)}  // useRef 배열로 각 스텝 이미지 입력 참조
              style={{ display: 'none' }}  // 숨김 처리
              onChange={(e) => handleStepChange(index, "image", e.target.files[0])}
            />
          </div>
          {/* {steps.length > 1 && (
            <button type="button" 
            className={styles.deleteButton}
            onClick={() => handleRemoveStep(step.id)}
            >
              X
            </button>
          )} */}
          <button
            type="button"
            className={styles.deleteButton}
            style={{ visibility: steps.length > 1 ? 'visible' : 'hidden' }} // X 버튼의 visibility 속성 조절
            onClick={() => handleRemoveStep(step.id)}
    >
      X
    </button>
        </div>
      ))}
      
      <button type="button" className={styles.addButton} onClick={handleAddStep}>
        + STEP 추가
      </button>
      </div>

      <button type="submit" className={styles.submitButton}>올리기</button>
      <button type="button" className={styles.cancelButton} onClick={() => navigate('/')}>취소</button>
    </form>
  );
};

export default PostForm;
