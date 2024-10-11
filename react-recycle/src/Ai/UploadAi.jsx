// Ai.js (기존 코드 그대로)
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import styles from '../styles/Ai.module.css'; // CSS 모듈 import

const UploadAi = () => {
  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState('');

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

  // 컴포넌트가 마운트될 때 모델과 메타데이터 로드
  useEffect(() => {
    loadMetadata();
    loadModel();
  }, []);

  // 이미지 분류 함수
  const classifyImage = async (event) => {
    const file = event.target.files[0];
    if (!file || !model) {
      alert('사진을 확인하여 다시 업로드 해주세요.');
      return;
    }

    // 이미지 미리보기 설정
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    // 이미지 로드 후 분류 시작
    const image = document.createElement('img');
    image.src = imageUrl;
    image.onload = async () => {
      // 이미지 전처리 (224x224로 크기 조정)
      const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224]) // 모델에 맞는 크기
        .toFloat()
        .expandDims(); // 배치를 추가하여 모델이 기대하는 형태로 변환

      // 모델을 사용하여 예측 수행
      const predictions = await model.predict(tensor).data();

      // 가장 높은 확률의 라벨을 찾기
      const maxIndex = predictions.indexOf(Math.max(...predictions));
      const highestProbability = (predictions[maxIndex] * 100).toFixed(2);

      // 결과 출력
      setResult(`선택한 사진의 종류: ${labels[maxIndex]} (${highestProbability}%)`);
    };
  };

  return (
    <div className={styles.wrap}>
      <h1>사진을 올려주세요</h1>

      {/* 파일 업로드 UI */}
      <div>
        <input 
          type="file" 
          onChange={classifyImage} 
          accept="image/*" 
          className={styles.fileInput} 
          id="file-upload" // id 추가
        />
        <label htmlFor="file-upload" className={styles.custombtn}>파일 선택</label>
      </div>

      {/* 이미지 미리보기 */}
      {imagePreview && (
        <div>
          <img src={imagePreview} alt="Uploaded" style={{ width: '300px', marginTop: '20px' }} />
        </div>
      )}

      {/* 예측 결과 표시 */}
      <p style={{ marginTop: '20px' }}>{result}</p>
    </div>
  );
};

export default UploadAi;
