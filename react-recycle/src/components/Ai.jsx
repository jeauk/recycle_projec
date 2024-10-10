import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import styles from '../styles/Ai.module.css'; // CSS 모듈 import

const Ai = () => {
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState('');
  const [useFrontCamera, setUseFrontCamera] = useState(true); // 전면/후면 카메라 선택 상태
  const videoRef = useRef(null); // 웹캠 비디오 스트림 참조
  const canvasRef = useRef(null); // 캔버스 참조

  // metadata.json에서 라벨 정보 가져오기
  const loadMetadata = async () => {
    try {
      const response = await fetch('/path/to/metadata.json');
      const metadata = await response.json();
      setLabels(metadata.labels);  // 메타데이터에서 라벨 가져오기
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

  // 컴포넌트가 마운트될 때 모델과 메타데이터 로드 및 웹캠 시작
  useEffect(() => {
    loadMetadata();
    loadModel();
    startWebcam(); // 웹캠 시작
  }, [useFrontCamera]); // useFrontCamera 값이 변경될 때마다 웹캠 다시 시작

  // 웹캠 시작 함수 (전면/후면 카메라 선택 가능)
  const startWebcam = async () => {
    try {
      const constraints = {
        video: {
          facingMode: useFrontCamera ? 'user' : 'environment', // 전면 또는 후면 카메라 선택
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam', error);
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

    // 캡처된 이미지 전처리 및 분류
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const tensor = tf.browser.fromPixels(imageData)
      .resizeNearestNeighbor([224, 224]) // 모델에 맞는 크기
      .toFloat()
      .expandDims(); // 배치를 추가하여 모델이 기대하는 형태로 변환

    const predictions = await model.predict(tensor).data();

    // 가장 높은 확률의 라벨을 찾기
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const highestProbability = (predictions[maxIndex] * 100).toFixed(2);

    // 결과 출력
    setResult(`선택한 사진의 종류: ${labels[maxIndex]} (${highestProbability}%)`);
  };

  // 카메라 전환 버튼 클릭 시 호출되는 함수
  const switchCamera = () => {
    setUseFrontCamera((prev) => !prev); // 전면/후면 카메라 전환
  };

  return (
    <div className={styles.wrap}>
      <h1>웹캠으로 촬영한 사진을 분류합니다</h1>

      {/* 웹캠 비디오 스트림 */}
      <div>
        <video ref={videoRef} autoPlay style={{ width: '300px', marginTop: '20px' }} />
      </div>

      {/* 웹캠에서 사진 캡처하고 분류하는 버튼 */}
      <div>
        <button onClick={captureAndClassifyImage} className={styles.custombtn}>
          사진 캡처 및 분류
        </button>
        {/* 카메라 전환 버튼 */}
        <button onClick={switchCamera} className={styles.custombtn} style={{ marginLeft: '10px' }}>
          {useFrontCamera ? '후면 카메라로 전환' : '전면 카메라로 전환'}
        </button>
      </div>

      {/* 예측 결과 표시 */}
      <p style={{ marginTop: '20px' }}>{result}</p>

      {/* 캡처된 이미지를 그리기 위한 캔버스 (화면에 보이지 않음) */}
      <canvas ref={canvasRef} width={224} height={224} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default Ai;
