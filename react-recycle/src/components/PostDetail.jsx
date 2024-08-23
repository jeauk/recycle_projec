import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();  
  const [post, setPost] = useState(null);
  const [recommendCount, setRecommendCount] = useState(0); // 추천수를 관리할 상태
  const [userEmail, setUserEmail] = useState(''); // 사용자의 이메일
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 이메일 가져오기 (예시: 로그인 정보에서 가져오기)
    const email = localStorage.getItem('userEmail'); // 로컬 스토리지나 다른 방법으로 이메일을 가져옴
    setUserEmail(email);

    // 게시글과 추천수를 함께 가져옴
    fetch(`http://localhost:8080/list/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }
        return response.json();
      })
      .then(data => {
        setPost(data);
        fetch(`http://localhost:8080/post/recommend/count/${id}`)
          .then(response => response.json())
          .then(countData => setRecommendCount(countData.recommendCount))
          .catch(error => console.error('추천 수를 가져오는데 실패했습니다.', error));
      })
      .catch(error => {
        console.error(error);
        alert('게시글을 가져오는데 실패했습니다.');
        navigate('/');
      });
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/post/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`http://localhost:8080/post/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('게시글 삭제 성공:', id);
          navigate('/');  // 삭제 후 메인 페이지로 이동
        } else {
          console.error('게시글 삭제 실패');
          alert('게시글 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRecommend = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post/recommend/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }), // 사용자의 이메일을 함께 전송
      });

      if (response.ok) {
        const updatedRecommend = await response.json();
        setRecommendCount(updatedRecommend.recommendCount === 1 ? recommendCount + 1 : recommendCount - 1);
      } else {
        console.error('게시글 추천 실패');
        alert('추천에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 추천 중 오류 발생:', error);
      alert('추천 중 오류가 발생했습니다.');
    }
  };

  if (!post) {
    return <p>게시글을 불러오는 중입니다...</p>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>추천 수: {recommendCount}</p> {/* 추천 수를 표시 */}
      <div>
        <button onClick={handleEdit}>수정</button>
        <button onClick={handleDelete}>삭제</button>
        <button onClick={handleRecommend}>{recommendCount > 0 ? '추천 해제' : '추천'}</button>
      </div>
    </div>
  );
}

export default PostDetail;
