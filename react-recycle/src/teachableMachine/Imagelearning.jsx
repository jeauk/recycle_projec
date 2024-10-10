import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function Imagelearning() {
  const [model, setModel] = useState(null);
  const [classNames, setClassNames] = useState([]); // 클래스 이름을 저장할 상태
  const [imageURL, setImageURL] = useState(null);
  const [prediction, setPrediction] = useState({ className: '', probability: 0 }); // 가장 높은 확률의 예측 결과를 저장할 상태

  // 모델과 클래스 이름을 로드하는 함수
  const loadModelAndMetadata = async () => {
    try {
      // 모델 로드
      const modelURL = process.env.PUBLIC_URL + '/model/model.json'; // 모델 경로
      const loadedModel = await tf.loadGraphModel(modelURL);
      setModel(loadedModel);

      // metadata.json에서 클래스 이름 가져오기
      const metadataURL = process.env.PUBLIC_URL + '/model/metadata.json'; // metadata 경로
      const metadataResponse = await fetch(metadataURL);
      const metadata = await metadataResponse.json();
      setClassNames(metadata.labels); // metadata에서 클래스 이름을 가져와 설정

      console.log('Model and metadata loaded successfully');
    } catch (error) {
      console.error('Failed to load the model or metadata:', error);
    }
  };

  // 이미지가 변경되면 모델을 사용해 예측하는 함수
  const predictImage = async (image) => {
    if (!model) return;

    try {
      // 이미지 데이터를 Tensor로 변환
      const img = tf.browser.fromPixels(image);
      const resizedImg = tf.image.resizeBilinear(img, [224, 224]);
      const tensor = resizedImg.expandDims(0).toFloat().div(127).sub(1);
      const predictions = await model.predict(tensor).data(); // 예측 값 가져오기

      // 가장 높은 확률을 가진 클래스와 확률 찾기
      const maxIndex = predictions.indexOf(Math.max(...predictions)); // 최대값의 인덱스 찾기
      const className = classNames[maxIndex];
      const probability = (predictions[maxIndex] * 100).toFixed(2); // 퍼센트로 변환

      // 예측 결과를 상태에 저장
      setPrediction({ className, probability });
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  useEffect(() => {
    loadModelAndMetadata(); // 컴포넌트가 처음 마운트될 때 모델과 메타데이터를 로드
  }, []);

  // 이미지가 선택된 후 로드될 때 예측 실행
  useEffect(() => {
    if (imageURL) {
      const imageElement = document.getElementById('uploadedImage');
      
      if (imageElement) {
        imageElement.onload = () => {
          predictImage(imageElement);
        };
      }
    }
  }, [imageURL]); // imageURL이 변경될 때마다 실행

  // 사용자가 이미지를 선택했을 때 처리하는 함수
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setImageURL(imageURL);
  };

  return (
    <div>
      <h1>Teachable Machine Image Classifier</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {imageURL && (
        <div>
          <img id="uploadedImage" src={imageURL} alt="uploaded" width="300" />
        </div>
      )}

      {prediction.className && (
        <div>
          <h2>Prediction:</h2>
          <p>
            Class: <strong>{prediction.className}</strong> <br />
            Probability: <strong>{prediction.probability}%</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default Imagelearning;
