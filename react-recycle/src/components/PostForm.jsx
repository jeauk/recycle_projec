import React, { useEffect, useState } from 'react';
import { Await, useNavigate } from 'react-router-dom';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // bbbbbbbbbbbbbbbbbb
  const [nickname, setNickname] = useState(''); // 사용자 닉네임 상태
  const [email, setEmail] = useState(''); // 사용자 이메일 상태
  const navigate = useNavigate();

  // 사용자의 이메일과 닉네임을 가져오는 useEffect
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken'); // 로컬 스토리지에서 액세스 토큰 가져오기

        if (!accessToken) {
          console.error("액세스 토큰이 없습니다.");
          return;
        }

        const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // 로컬 스토리지에서 가져온 토큰 사용
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        });

        const userData = await userResponse.json();

        if (userResponse.ok) {
          setNickname(userData.properties.nickname);
          setEmail(userData.kakao_account.email);
        } else {
          console.error("사용자 정보를 가져오는데 실패했습니다:", userData);
        }
      } catch (error) {
        console.error("에러:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // 이미지 핸들러 함수
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      kakaoUserEntity: {
        email,
        nickname
      },
      title,
      content
    };

    try {
      // 텍스트를 JSON 형식으로 전송
      const textResponse = await fetch('http://localhost:8080/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });

      const textData = await textResponse.json();
      console.log('텍스트 성공:', textData);

      // 이미지가 있으면 이미지 파일을 FormData로 전송
      if (image) {
        const formData = new FormData(); 
        formData.append('image', image); 

        const imageResponse = await fetch(`http://localhost:8080/post/${textData.id}/image`, {
          method: 'POST',
          body: formData 
        });

        const imageData = await imageResponse.json();
        console.log('이미지 성공:', imageData);
      }

      navigate('/'); 
    } catch (error) {
      console.error('에러:', error);
    }

    setTitle('');
    setContent('');
    setImage(null);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>

      <div>
        <label>이미지 첨부</label>
        <input
          type="file"
          accept="image/*" // 이미지 파일만
          onChange={handleImageChange}
        />
      </div> 

      <button type="submit">올리기</button>
    </form>
  );
}

export default PostForm;
