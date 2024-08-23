import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PostEdit() {
  const { id } = useParams();  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState(''); // 사용자 닉네임 상태
  const [email, setEmail] = useState(''); // 사용자 이메일 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글의 기존 데이터를 가져오기
    fetch(`http://localhost:8080/list/${id}`)
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(error => {
        console.error('게시글을 가져오는데 실패했습니다.', error);
        alert('게시글을 가져오는데 실패했습니다.');
        navigate('/');
      });

    // 사용자 정보 가져오기
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
          // 필요한 정보만 추출
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
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedPost = {
      kakaoUserEntity: {
        email,
        nickname
      },
      title,
      content
    };

    try {
      const response = await fetch(`http://localhost:8080/post/edit/${id}`, { // 수정된 엔드포인트
        method: 'POST', // POST 메서드를 사용하여 업데이트 요청
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        console.log('게시글 수정 성공:', id);
        navigate(`/post/${id}`);  // 수정 후 해당 게시글의 상세 페이지로 이동
      } else {
        console.error('게시글 수정 실패');
        alert('게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleUpdate}>
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
      <button type="submit">수정하기</button>
    </form>
  );
}

export default PostEdit;
