import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function Imagelearning() {
  const [model, setModel] = useState(null);
  const [classNames, setClassNames] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [prediction, setPrediction] = useState({ className: '', probability: 0 });

  // 모델과 클래스 이름을 로드하는 함수
  const loadModelAndMetadata = async () => {
    try {
      // 모델 URL (외부 URL)
      const modelURL = 'https://storage.googleapis.com/tm-model/ACcgyD3Fn/model.json'; 
      const metadataURL = 'https://storage.googleapis.com/tm-model/ACcgyD3Fn/metadata.json';

      // 모델 로드
      console.log('Attempting to load model from:', modelURL);
      const loadedModel = await tf.loadGraphModel(modelURL); 
      setModel(loadedModel);

      // 메타데이터 로드
      console.log('Attempting to load metadata from:', metadataURL);
      const metadataResponse = await fetch(metadataURL);
      if (!metadataResponse.ok) {
        throw new Error('Failed to load metadata.json');
      }
      const metadata = await metadataResponse.json();
      setClassNames(metadata.labels); // metadata에서 클래스 이름 가져오기

      console.log('Model and metadata loaded successfully');
    } catch (error) {
      console.error('Failed to load the model or metadata:', error);
    }
  };

  // 이미지가 변경되면 모델을 사용해 예측하는 함수
  const predictImage = async (image) => {
    if (!model) return;

    try {
      const img = tf.browser.fromPixels(image);
      const resizedImg = tf.image.resizeBilinear(img, [224, 224]);
      const tensor = resizedImg.expandDims(0).toFloat().div(127).sub(1);
      const predictions = await model.predict(tensor).data();

      const maxIndex = predictions.indexOf(Math.max(...predictions)); // 최대값의 인덱스 찾기
      const className = classNames[maxIndex];
      const probability = (predictions[maxIndex] * 100).toFixed(2); // 퍼센트로 변환

      setPrediction({ className, probability });
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  useEffect(() => {
    loadModelAndMetadata(); // 모델과 메타데이터 로드
  }, []);

  useEffect(() => {
    if (imageURL) {
      const imageElement = document.getElementById('uploadedImage');
      if (imageElement) {
        imageElement.onload = () => {
          predictImage(imageElement);
        };
      }
    }
  }, [imageURL]);

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
