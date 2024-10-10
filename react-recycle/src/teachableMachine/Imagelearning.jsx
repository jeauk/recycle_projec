import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

function Imagelearning() {
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [classNames, setClassNames] = useState([]);

  // 모델을 로드하는 함수
  const loadModel = async () => {
    try {
      const modelURL = process.env.PUBLIC_URL + '/model/model.json'; // 모델 경로
      const loadedModel = await tf.loadGraphModel(modelURL);
      const response = await fetch(modelURL); // 모델 JSON에서 클래스 이름 가져오기
      const modelData = await response.json();
      setClassNames(modelData.labels); // labels에 저장된 클래스 이름 사용
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
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      const imageElement = document.getElementById('uploadedImage');
      if (imageElement) {
        imageElement.onload = () => predictImage(imageElement);
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

      {predictions.length > 0 && (
        <div>
          <h2>Predictions:</h2>
          <ul>
            {predictions.map((p, index) => (
              <li key={index}>
                {classNames[index]}: {(p * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Imagelearning;
