import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


function PostDetail() {
  const { id } = useParams();  
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/list/${id}`) // 서버에서 특정 ID의 게시글을 가져오는 엔드포인트
      .then(response => {
        if (!response.ok) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }
        return response.json();
      })
      .then(data => setPost(data))
      .catch(error => {
        console.error(error);
        alert('게시글을 가져오는데 실패했습니다.');
        navigate('/');
      });
  }, [id, navigate]);

  if (!post) {
    return <p>게시글을 불러오는 중입니다...</p>;
  }
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

  const handleRecommend = () => {
    console.log('게시글 추천:', id);
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div>
        <button onClick={handleEdit}>수정</button>
        <button onClick={handleDelete}>삭제</button>
        <button onClick={handleRecommend}>추천</button>
      </div>
    </div>
  );
}

export default PostDetail;