import React, { useState, useEffect } from 'react'; //전체추가

function MyPage() {
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const jwt = sessionStorage.getItem('jwt');
      const response = await fetch('http://localhost:8080/user/profile', {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      const data = await response.json();
      setNickname(data.nickname);
      setProfileImageUrl(data.profileImageUrl); //이미지가 저장된 위치를 가리키는 url문자열
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nickname', nickname);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const jwt = sessionStorage.getItem('jwt');
    await fetch('http://localhost:8080/user/profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    // 업데이트 후 알림 또는 리다이렉트 처리
    alert('프로필이 성공적으로 업데이트되었습니다!');
  };

  return (
    <div>
      <h1>My Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>닉네임:</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label>프로필 이미지:</label>
          {profileImageUrl && <img src={profileImageUrl} alt="Profile" />}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit">프로필 업데이트</button>
      </form>
    </div>
  );
}

export default MyPage;