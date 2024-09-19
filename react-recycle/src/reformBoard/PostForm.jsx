import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './PostForm.module.css';
import Cropper from 'react-easy-crop';

// 이미지 크롭 후 Blob 반환 함수
const getCroppedImg = (imageSrc, crop) => {
  const canvas = document.createElement('canvas');
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        resolve(blob); // Blob 반환
      }, 'image/jpeg');
    };
    image.onerror = reject;
  });
};

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);

  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  const mainImageInputRef = useRef(null); // 메인 이미지 입력 Ref
  const stepImageInputRefs = useRef([]);  // Step 이미지 입력 Ref 배열

  // 이미지 크롭 완료 처리 함수
  const handleCropComplete = async () => {
    const croppedImage = await getCroppedImg(imagePreview, croppedArea);  // 자른 이미지 Blob 생성
    setCroppedImageBlob(croppedImage); // Blob을 저장하여 서버로 전송 준비
    setImagePreview(URL.createObjectURL(croppedImage));  // 자른 이미지 미리보기
    setIsCropping(false);  // 크롭 모드 종료
  };

  // 메인 이미지 선택 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // 메인 이미지 미리보기 설정
    setIsCropping(true);
  };

  // 동영상 썸네일 추출 처리
  const handleChange = async (e) => {
    const value = e.target.value;
    if (!isValidVideoUrl(value)) {
      setErrorMessage('유튜브나 네이버 링크로 작성해주세요.');
    } else {
      setErrorMessage('');
      const thumbnail = await generateThumbnailUrl(value);
      setThumbnailUrl(thumbnail);
    }
    setVideoLink(value);
  };

  const isValidVideoUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('tv.naver.com') || url.includes('naver.me');
  };

  const generateThumbnailUrl = async (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/0.jpg`;
    } else if (url.includes('naver.com')) {
      try {
        const response = await fetch('http://localhost:8080/naver', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (!response.ok) {
          throw new Error('네이버 썸네일을 가져오는 데 실패했습니다.');
        }
        const result = await response.json();
        return result.thumbnailUrl;
      } catch (error) {
        console.error('네이버 썸네일 추출 실패:', error);
        return '';
      }
    }
    return '';
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (croppedImageBlob) {
      formData.append("image", croppedImageBlob, "croppedImage.jpg"); // 자른 이미지 Blob을 추가
    }
    formData.append("videoLink", videoLink);

    steps.forEach((step, index) => {
      formData.append(`steps[${index}]`, step.content);
      if (step.image) {
        formData.append(`stepImages[${index}]`, step.image);
      }
    });

    try {
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: { "Authorization": `Bearer ${jwt}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`게시물을 업로드하는 데 실패했습니다. 상태 코드: ${response.status}`);
      }
      alert("게시물이 성공적으로 업로드되었습니다!");
      navigate('/');
    } catch (error) {
      alert(`게시물 업로드 중 문제가 발생했습니다: ${error.message}`);
    }
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

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.mainContent}>
        <div className={styles.imageUpload} onClick={() => mainImageInputRef.current.click()}>
          {imagePreview ? (
            <img src={imagePreview} alt="미리보기" className={styles.imagePreview} />
          ) : (
            <div className={styles.imagePlaceholder}>여기에 이미지 첨부 (대표 완성 사진)</div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={mainImageInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
            required
          />
        </div>

        {isCropping && (
          <div className={styles.cropContainer}>
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={5 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
            />
            <button className={styles.cropButton} type="button" onClick={handleCropComplete}>완료</button>
          </div>
        )}

        <div className={styles.inputFields}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            value={title}
            placeholder="제목을 입력하세요"
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.inputField}
          />
          <label className={styles.label}>재료</label>
          <input
            type="text"
            value={content}
            placeholder="재료를 입력하세요"
            onChange={(e) => setContent(e.target.value)}
            required
            className={styles.contentInput}
          />
        </div>
      </div>

      <div className={styles.videoLinkContainer}>
        <label className={styles.label}>동영상 링크 (유튜브 등)</label>
        <input
          type="url"
          value={videoLink}
          onChange={handleChange}
          placeholder="링크가 없을 경우 칸을 비워주세요."
          style={{ borderColor: errorMessage ? 'red' : '' }}
          className={styles.inputField}
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {thumbnailUrl && (
          <div className={styles.thumbnailBox}>
            <img src={thumbnailUrl} alt="Video Thumbnail" className={styles.thumbnailImage} />
          </div>
        )}
      </div>

      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepContainer}>
            <div className={styles.stepContent}>
              <label className={styles.label}>STEP {index + 1}</label>
              <textarea
                value={step.content}
                onChange={(e) => handleStepChange(index, "content", e.target.value)}
                required
                className={styles.textareaField}
              ></textarea>
            </div>
            <div className={styles.stepImageUpload} onClick={() => stepImageInputRefs.current[index].click()}>
              {step.imagePreview ? (
                <img src={step.imagePreview} alt={`STEP ${index + 1} 미리보기`} className={styles.imagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>여기에 STEP 이미지 첨부</div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={(el) => (stepImageInputRefs.current[index] = el)}
                style={{ display: 'none' }}
                onChange={(e) => handleStepChange(index, "image", e.target.files[0])}
              />
            </div>
            <button type="button" className={styles.deleteButton} onClick={() => handleRemoveStep(step.id)}>X</button>
          </div>
        ))}
        <button type="button" className={styles.addButton} onClick={handleAddStep}>+ STEP 추가</button>
      </div>

      <button type="submit" className={styles.submitButton}>올리기</button>
      <button type="button" className={styles.cancelButton} onClick={() => navigate('/')}>취소</button>
    </form>
  );
};

export default PostForm;
