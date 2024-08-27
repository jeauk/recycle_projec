import React, { useState, useEffect } from 'react'; // React와 관련된 훅을 가져옴

function MyPage() {
  // 상태 변수 설정: 닉네임, 프로필 이미지 파일, 프로필 이미지 URL
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // 컴포넌트가 마운트될 때 프로필 정보를 가져옴
  useEffect(() => {
    const fetchProfile = async () => {
      const jwt = sessionStorage.getItem('jwt'); // 세션에서 JWT 토큰을 가져옴
      const response = await fetch('http://localhost:8080/user/profile', {
        headers: { Authorization: `Bearer ${jwt}` } // JWT 토큰을 Authorization 헤더에 추가
      });
      const data = await response.json(); // 서버 응답을 JSON 형식으로 파싱
      setNickname(data.nickname); // 닉네임 설정
      setProfileImageUrl(data.profileImageUrl); // 프로필 이미지 URL 설정
    };

    fetchProfile(); // 프로필 정보를 가져오는 함수 호출
  }, []); // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때 한 번만 실행

  // 이미지 파일 선택 시 호출되는 함수
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]); // 선택한 파일을 상태에 저장
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
    await fetch('http://localhost:8080/user/profile', {
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
      <h1>My Page</h1>
      <form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 함수 호출 */}
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
          {/* 프로필 이미지 URL이 있으면 이미지 표시 */}
          {profileImageUrl && <img src={profileImageUrl} alt="Profile" />}
          <input type="file" accept="image/*" onChange={handleImageChange} /> {/* 이미지 파일 선택 시 handleImageChange 함수 호출 */}
        </div>
        <button type="submit">프로필 업데이트</button> {/* 제출 버튼 */}
      </form>
    </div>
  );
}

export default MyPage;
