import React, { useState, useEffect, useRef } from 'react';
import Kakaobtn from './KakaoBtn'; // 로그인 버튼 컴포넌트를 사용한다고 가정
import styles from './MyPage.module.css';
import { useNavigate } from 'react-router-dom';

function ProfileUpdateForm() {
  const navigate = useNavigate();
  // 로그인 상태를 관리하는 state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 상태 변수 설정: 닉네임, 프로필 이미지 파일, 프로필 이미지 URL (미리보기용 및 기존 이미지)
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const fileInputRef = useRef(null);

  const myBackDomain = 'https://trashformer.site';

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태를 확인
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      setIsLoggedIn(true); // JWT 토큰이 있으면 로그인 상태로 설정
    } else {
      setIsLoggedIn(false); // JWT 토큰이 없으면 로그아웃 상태로 설정
      setProfileImageUrl('/img/loginplz.jpg');
    }

    // 기존 프로필 정보를 가져오는 로직
    const fetchProfile = async () => {
      if (jwt) { // JWT가 있는 경우에만 프로필 정보를 가져옴
        const response = await fetch(myBackDomain+'/user/profile', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        setNickname(data.nickname); // 닉네임 설정
        setProfileImageUrl(data.profileImageUrl); // 기존 프로필 이미지 URL 설정
        
      }
    };

    if (isLoggedIn) {
      fetchProfile(); // 로그인 상태에서만 프로필 정보를 가져옴
    }
  }, [isLoggedIn]);

  // 이미지 파일 선택 시 호출되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택된 파일을 가져옴
    if (file) {
      setProfileImage(file); // 상태에 파일 저장

      // 파일을 읽어 미리보기 URL을 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result); // 새로운 이미지 미리보기 URL을 상태에 저장
      };
      reader.readAsDataURL(file); // 파일을 Data URL로 읽기
    } else {
      setProfileImage(null);
      setProfileImageUrl(''); // 파일이 없을 경우 미리보기 초기화
    }
  };

    // 프로필 이미지를 클릭하면 파일 선택 창을 엶
    const handleProfileClick = () => {
      if (isLoggedIn) {
        fileInputRef.current.click();  // 로그인되어 있을 때만 파일 선택 창 열기
      }
    };

    const handleContactClick = () => {
      navigate('/contact');
    };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막음

    const formData = new FormData(); // 새로운 FormData 객체 생성
    formData.append('nickname', nickname); // 닉네임을 FormData에 추가
    if (profileImage) {
      formData.append('profileImage', profileImage); // 선택한 이미지 파일이 있으면 FormData에 추가
    }

    const jwt = sessionStorage.getItem('jwt'); // 세션에서 JWT 토큰을 가져옴
    await fetch(myBackDomain+'/user/updateProfile', {
      method: 'POST', // POST 메서드로 서버에 요청
      headers: {
        Authorization: `Bearer ${jwt}`, // JWT 토큰을 Authorization 헤더에 추가
      },
      body: formData, // FormData 객체를 요청 본문에 추가
    });

    // 업데이트 후 알림 표시 또는 리다이렉트 처리
    alert('프로필이 성공적으로 업데이트되었습니다!');
    window.location.reload()
  };

  return (
    <div>
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>{nickname ? `${nickname} 사용자님, 안녕하세요` : ' 사용자님, 안녕하세요'}</h1>
      </div>
       <div className={styles.container}>
        {/* 왼쪽 상단 프로필 이미지와 닉네임 입력란 */}
        <div className={styles.profileContainer}>
          <img 
            src={profileImageUrl} 
            className={styles.profileImage} 
            onClick={handleProfileClick}
            style={{ cursor: isLoggedIn ? 'pointer' : 'default' }}
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            value={nickname}
            placeholder="닉네임"
            maxLength={7}
            className={styles.nicknameInput}
            onChange={(e) => setNickname(e.target.value)}
            readOnly={!isLoggedIn}  // 로그인이 안되었을 때는 입력할 수 없도록 설정
          />
          {isLoggedIn && (
            <button onClick={handleSubmit} className={styles.submitButton}>
              프로필 업데이트
            </button>
          )}
          <button onClick={handleContactClick} className={styles.contactButton}>
            문의하기
          </button>
        </div>

        {isLoggedIn ? (
          <div className={styles.loginContainer}>
            <div className={styles.buttonList}>
              <div className={styles.buttonItem} onClick={() => navigate('/mypage/mylist')}>
                <span className={styles.buttonLabel}>내가 쓴 리폼 게시글</span>
              </div>
              <div className={styles.buttonItem} onClick={() => navigate('/mypage/myrecommend')}>
                <span className={styles.buttonLabel}>내가 추천한 리폼 게시글</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.loginContainer}>
            <p className={styles.loginBoxText}>
              게시글 쓰기 컨텐츠를 이용하기 위해서는 로그인이 필요합니다.
            </p>
            <div className={styles.kakaoBtnContainer}>
              <Kakaobtn onLogin={() => setIsLoggedIn(true)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}

export default ProfileUpdateForm;
