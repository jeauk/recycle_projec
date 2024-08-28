import React, { useState, useEffect } from 'react';

function ProfileUpdateForm() {
  // 상태 변수 설정: 닉네임, 프로필 이미지 파일, 프로필 이미지 URL (미리보기용 및 기존 이미지)
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    // 기존 프로필 정보를 가져오는 로직 (예: 서버에서 프로필 정보 가져오기)
    const fetchProfile = async () => {
      const jwt = sessionStorage.getItem('jwt'); // 세션에서 JWT 토큰을 가져옴
      const response = await fetch('http://localhost:8080/user/profile', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await response.json();
      setNickname(data.nickname); // 닉네임 설정
      setProfileImageUrl(data.profileImageUrl); // 기존 프로필 이미지 URL 설정
    };

    fetchProfile(); // 컴포넌트 마운트 시 프로필 정보를 가져옴
  }, []);

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

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막음

    const formData = new FormData(); // 새로운 FormData 객체 생성
    formData.append('nickname', nickname); // 닉네임을 FormData에 추가
    if (profileImage) {
      formData.append('profileImage', profileImage); // 선택한 이미지 파일이 있으면 FormData에 추가
    }

    const jwt = sessionStorage.getItem('jwt'); // 세션에서 JWT 토큰을 가져옴
    await fetch('http://localhost:8080/user/updateProfile', {
      method: 'POST', // POST 메서드로 서버에 요청
      headers: {
        Authorization: `Bearer ${jwt}`, // JWT 토큰을 Authorization 헤더에 추가
      },
      body: formData, // FormData 객체를 요청 본문에 추가
    });

    // 업데이트 후 알림 표시 또는 리다이렉트 처리
    alert('프로필이 성공적으로 업데이트되었습니다!');
  };

  return (
    <div>
      <h1>프로필 업데이트</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>닉네임:</label>
          <input
            type="text"
            value={nickname} // 상태 변수에 바인딩
            onChange={(e) => setNickname(e.target.value)} // 입력 변경 시 닉네임 상태 업데이트
          />
        </div>
        <div>
          <label>프로필 이미지:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} /> {/* 이미지 파일 선택 시 handleImageChange 함수 호출 */}
          {profileImageUrl && <img src={profileImageUrl} alt="Profile Preview" style={{ width: '150px', height: '150px' }} />} {/* 미리보기 이미지 또는 기존 이미지 */}
        </div>
        <button type="submit">프로필 업데이트</button> {/* 제출 버튼 */}
      </form>
    </div>
  );
}

export default ProfileUpdateForm;
