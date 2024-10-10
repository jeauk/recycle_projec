import React, { useState, useEffect } from 'react';
import WebcamAi from './WebcamAi'; // 사진 찍기 컴포넌트
import styles from '../styles/MainPage.module.css'; // 스타일
import UploadAi from './UploadAi';

const AiMainPage = () => {
  const [mode, setMode] = useState(null); // 'upload' 또는 'camera'로 모드 설정

  // 모드를 설정하여 다른 컴포넌트 보여주기
  const handleUploadClick = () => {
    setMode('upload');
  };

  const handleCameraClick = () => {
    setMode('camera');
  };

  useEffect(() => {
    // 모바일에서 스크롤 비활성화
    document.body.style.overflow = 'hidden';

    return () => {
      // 컴포넌트가 사라질 때 스크롤 원상복구
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1>이미지를 분류하세요</h1>

      {/* 모드가 선택되지 않았을 때 버튼 두 개 보여주기 */}
      {!mode && (
        <div>
          <button onClick={handleUploadClick} className={styles.btn}>업로드</button>
          <button onClick={handleCameraClick} className={styles.btn}>사진 찍기</button>
        </div>
      )}

      {/* 업로드 모드일 때 Ai 컴포넌트 보여주기 */}
      {mode === 'upload' && <UploadAi />}

      {/* 사진 찍기 모드일 때 WebcamAi 컴포넌트 보여주기 */}
      {mode === 'camera' && <WebcamAi />}
    </div>
  );
};

export default AiMainPage;
