import React, { useState } from 'react';
import styles from '../styles/FreeBulletinBoardPost.module.css'; // 모듈 CSS import

const FreeBulletinBoardPost = () => {
  // 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [passwordError, setPasswordError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const myBackDomain = "http://localhost:8080";

  // 입력 핸들러 함수
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  // 닉네임 입력 핸들러 함수
  const handleNicknameChange = (e) => {
    const value = e.target.value;

    const byteLength = value.split('').reduce((acc, char) => {
      return acc + (char.match(/[ㄱ-ㅎ가-힣]/) ? 2 : 1);
    }, 0);

    if (byteLength <= 16 && /^[a-zA-Z0-9ㄱ-ㅎ가-힣]*$/.test(value)) {
      setNickname(value);
      setNicknameError(false);
    } else {
      setNicknameError(true);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const isValid = /^[0-9]{0,4}$/.test(value);

    if (isValid) {
      setPassword(value);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length !== 4 || !/^[0-9]+$/.test(password)) {
      setPasswordError(true);
      return;
    }

    if (nicknameError) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('nickname', nickname);
    formData.append('password', password);
    formData.append('image', image);

    const DataInput = async () => {
      const url = myBackDomain + "/freeBoard/post";
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          console.log('게시물 등록 성공');
        } else {
          console.error('게시물 등록 실패');
        }
      } catch (error) {
        console.error('네트워크 오류:', error);
      }
    };

    DataInput();
  };

  return (
    <div className={styles.container}>
      <h2>게시물 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>제목:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
            placeholder="제목을 입력하세요"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>내용:</label>
          <textarea
            value={content}
            onChange={handleContentChange}
            required
            placeholder="내용을 입력하세요"
            className={styles.textarea}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>닉네임 (최대 8글자, 특수문자 불가):</label>
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            required
            placeholder="닉네임을 입력하세요"
            className={styles.input}
          />
          {nicknameError && (
            <div className={styles.errorMessage}>
              닉네임은 한글 8자 이내, 영문/숫자 8자 이내로 입력할 수 있습니다.
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>비밀번호 (4자리 숫자):</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            maxLength="4"
            pattern="[0-9]*"
            placeholder="비밀번호를 입력하세요"
            className={styles.input}
          />
          {passwordError && (
            <div className={styles.errorMessage}>
              비밀번호는 4자리 숫자여야 합니다.
            </div>
          )}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>이미지 업로드:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.input}
          />
          {imagePreview && (
            <div className={styles.imgPreview}>
              <img src={imagePreview} alt="이미지 미리보기" />
            </div>
          )}
        </div>
        <button type="submit" className={styles.submitButton}>
          게시물 등록
        </button>
      </form>
    </div>
  );
};

export default FreeBulletinBoardPost;
