import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function Imagelearning() {
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [predictions, setPredictions] = useState([]);

  // 모델을 로드하는 함수
  const loadModel = async () => {
    try {
      const modelURL = process.env.PUBLIC_URL + '/model/model.json'; // Teachable Machine에서 다운로드한 모델 경로
      const loadedModel = await tf.loadGraphModel(modelURL);
      setModel(loadedModel);
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load the model:', error);
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
      const prediction = await model.predict(tensor).data();

      setPredictions(Array.from(prediction));
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  useEffect(() => {
    loadModel(); // 컴포넌트가 처음 마운트될 때 모델을 로드
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
          <img id="uploadedImage" src={imageURL} alt="uploaded" />
        </div>
      )}

      {predictions.length > 0 && (
        <div>
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((p, index) => (
              <li key={index}>Class {index}: {p.toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Imagelearning;
