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
  const myBackDomain = "http://trashformer.site:8080";

  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  const mainImageInputRef = useRef(null); // 메인 이미지 입력 Ref
  const stepImageInputRefs = useRef([]);  // Step 이미지 입력 Ref 배열
  const [isStepCropping, setIsStepCropping] = useState(Array(steps.length).fill(false));
  const [croppedStepImages, setCroppedStepImages] = useState([]);

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
        const response = await fetch(myBackDomain + '/naver', {
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
    if (!croppedImageBlob) {
      alert("대표 사진을 넣어주세요");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (croppedImageBlob) {
      formData.append("image", croppedImageBlob, "croppedImage.jpg"); // 자른 이미지 Blob을 추가
    }
    formData.append("videoLink", videoLink);

    steps.forEach((step, index) => {
      formData.append(`steps[${index}]`, step.content);
      if (croppedStepImages[index]) {
        formData.append(`stepImages[${index}]`, croppedStepImages[index], `stepImage${index}.jpg`);
      } else if (step.image) {
        // 크롭되지 않은 경우 원본 이미지 추가
        formData.append(`stepImages[${index}]`, step.image);
      }
    });

    try {
      const response = await fetch(myBackDomain + "/api/posts", {
        method: "POST",
        headers: { "Authorization": `Bearer ${jwt}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`게시물을 업로드하는 데 실패했습니다. 상태 코드: ${response.status}`);
      }
      alert("게시물이 성공적으로 업로드되었습니다!");
      navigate('/list');
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

  const handleStepCropComplete = async (index) => {
    const croppedImage = await getCroppedImg(steps[index].imagePreview, croppedArea);
    const updatedStepImages = [...croppedStepImages];
    updatedStepImages[index] = croppedImage;
    setCroppedStepImages(updatedStepImages);

    // 크롭 모드 비활성화
    setIsStepCropping(prev => prev.map((val, i) => i === index ? false : val));
  };

  const handleStepImageChange = (index, e) => {
    const file = e.target.files[0];
    const newSteps = [...steps];
    newSteps[index].image = file;
    newSteps[index].imagePreview = URL.createObjectURL(file);
    setSteps(newSteps);

    // 크롭 모드 활성화
    const updatedCropState = [...isStepCropping];
    updatedCropState[index] = true;
    setIsStepCropping(updatedCropState);
    window.scrollTo(0, 500);
  };

  return (
    <>
      {isCropping && (
        <div style={{
          'position': 'absolute',
          'zIndex': 1000,
          'height': '80vh',
          'width': '80vw',
          'backgroundColor': '#00000077',
          'top': 0,
          'zIndex': 10000
        }}>
          <div style={{
            'display': 'flex',
            flexDirection: 'column',
            height: '100%',
            paddingTop: '15%'
          }}>
            <div style={{
              'position': 'relative',
              'height': '100%',
              'width': '100%'
            }}>
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={5 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
              />
            </div>
            <div style={{
              'position': 'relative',
              'height': '100%',
              'width': '100%'
            }}>
              <button className={styles.cropButton} type="button" onClick={handleCropComplete}>완료</button>
            </div>
          </div>
        </div>

      )}

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
            />
          </div>


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
            <textarea
              value={content}
              placeholder="재료를 입력하세요"
              onChange={(e) => setContent(e.target.value)}
              required
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

              <div className={styles.stepImageUpload} onClick={() => handleStepImageClick(index)}>
                {croppedStepImages[index] ? (
                  <img src={URL.createObjectURL(croppedStepImages[index])} alt={`STEP ${index + 1} 미리보기`} className={styles.imagePreview} />
                ) : (
                  <div className={styles.imagePlaceholder}>여기에 STEP 이미지 첨부</div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (stepImageInputRefs.current[index] = el)}  // useRef 배열로 각 스텝 이미지 입력 참조
                  style={{ display: 'none' }}  // 숨김 처리
                  onChange={(e) => handleStepImageChange(index, e)}
                />
              </div>

              {isStepCropping[index] && (
                <div style={{
                  'position': 'absolute',
                  'zIndex': 1000,
                  'height': '80vh',
                  'width': '80vw',
                  'backgroundColor': '#00000077',
                  'top': '80vh',
                  'zIndex': 10000
                }}>
                  <div style={{
                    'display': 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    paddingTop: '15%'
                  }}>
                    <div style={{
                      'position': 'relative',
                      'height': '100%',
                      'width': '100%'
                    }}>
                      <Cropper
                        image={steps[index].imagePreview}
                        crop={crop}
                        zoom={zoom}
                        aspect={5 / 3}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
                      />
                    </div>
                    <div style={{
                      'position': 'relative',
                      'height': '100%',
                      'width': '100%'
                    }}>
                      <button className={styles.cropButton} type="button" onClick={() => handleStepCropComplete(index)}>완료</button>
                    </div>
                  </div>
                </div>
              )}

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

        <button type="submit" className={styles.submitButton} >올리기</button>
        <button type="button" className={styles.cancelButton} onClick={() => navigate('/')}>취소</button>
      </form>
    </>
  );
};

export default PostForm;