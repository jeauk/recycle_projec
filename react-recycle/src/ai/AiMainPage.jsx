import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import styles from '../styles/AiMainPage.module.css'; // 스타일

const AiMainPage = () => {
  const [mode, setMode] = useState(null); // 'upload' 또는 'camera' 모드
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState('');
  const [isFrontCamera, setIsFrontCamera] = useState(true); // 전면/후면 카메라 선택 상태
  const videoRef = useRef(null); // 웹캠 비디오 스트림 참조
  const canvasRef = useRef(null); // 캔버스 참조

  // metadata.json에서 라벨 정보 가져오기
  const loadMetadata = async () => {
    try {
      const response = await fetch('/path/to/metadata.json');
      const metadata = await response.json();
      setLabels(metadata.labels);
      console.log('Labels loaded:', metadata.labels);
    } catch (error) {
      console.error('Error loading metadata', error);
    }
  };

  // 모델 로드 함수
  const loadModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('/path/to/model.json');
      setModel(loadedModel);
      console.log('Model Loaded Successfully');
    } catch (error) {
      console.error('Error loading model', error);
    }
  };

  // useEffect를 이용하여 모델과 메타데이터를 로드
  useEffect(() => {
    loadMetadata();
    loadModel();
  }, []);

  // 이미지 분류 함수
  const classifyImage = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) {
      alert('모델을 로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    // 이미지 미리보기 설정
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    // 이미지 로드 후 분류 시작
    const image = new Image();
    image.src = imageUrl;
    image.onload = async () => {
      const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();

      const predictions = await model.predict(tensor).data();
      const maxIndex = predictions.indexOf(Math.max(...predictions));
      const highestProbability = (predictions[maxIndex] * 100).toFixed(2);

      setResult(`선택한 사진의 종류: ${labels[maxIndex]} (${highestProbability}%)`);
    };
  };

  // 웹캠 시작 함수
  const startWebcam = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment', // 전면 카메라: 'user', 후면 카메라: 'environment'
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
      }
    } catch (error) {
      console.error('웹캠 접근 중 오류 발생:', error);
    }
  };

  // 웹캠에서 이미지 캡처하고 분류하기
  const captureAndClassifyImage = async () => {
    if (!model || !videoRef.current) {
      alert('모델을 로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const tensor = tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    const predictions = await model.predict(tensor).data();
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const highestProbability = (predictions[maxIndex] * 100).toFixed(2);

    setResult(`선택한 사진의 종류: ${labels[maxIndex]} (${highestProbability}%)`);
  };

  // 모드를 설정하여 업로드 또는 웹캠 기능으로 전환
  const handleUploadClick = () => {
    setMode('upload');
  };

  const handleCameraClick = () => {
    setMode('camera');
    startWebcam(); // 카메라 모드일 때 웹캠 시작
  };

  // 카메라 전환 함수
  const switchCamera = () => {
    setIsFrontCamera((prev) => !prev); // 전면과 후면 카메라 전환
    startWebcam(); // 카메라 재시작
  };

  return (
    <div className={styles.container}>
      <h1>이미지를 분류하세요</h1>

      {/* 모드가 선택되지 않았을 때 버튼 두 개 보여주기 */}
      {!mode && (
        <div className={styles.buttonContainer}>
          <button onClick={handleUploadClick} className={styles.btn}>업로드</button>
          <button onClick={handleCameraClick} className={styles.btn}>카메라</button>
        </div>
      )}

      {/* 업로드 모드일 때 */}
      {mode === 'upload' && (
        <div className={styles.wrap}>
          <h2>사진을 올려주세요</h2>
          <input
            type="file"
            onChange={classifyImage}
            accept="image/*"
            className={styles.input}
            id="file-upload"
          />
          {imagePreview && (
            <div>
              <img src={imagePreview} alt="Uploaded" style={{ width: '300px', marginTop: '20px' }} />
            </div>
          )}
          <p>{result}</p>
          <button onClick={handleCameraClick} className={styles.changeBtn}>카메라</button>
        </div>
      )}

      {/* 사진 찍기 모드일 때 */}
      {mode === 'camera' && (
        <div className={styles.wrap}>
          <h2>웹캠으로 촬영한 사진을 분류합니다</h2>
          <video ref={videoRef} autoPlay style={{ width: '300px', marginTop: '16px' }} />
          <p>{result}</p>
          <canvas ref={canvasRef} width={224} height={224} style={{ display: 'none' }}></canvas>
          <button onClick={captureAndClassifyImage} className={styles.btn}>캡처</button>
          <button onClick={switchCamera} className={styles.btn}>
            카메라 전환
          </button>
          <button onClick={handleUploadClick} className={styles.changeBtn}>업로드</button>
        </div>
      )}
    </div>
  );
};

export default AiMainPage;
