import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// PostList데이터 가져오기
const examplePosts = [
  { id: 1, title: '111111111111', content: '111111' },
  { id: 2, title: '22222', content: '22222222' },
  { id: 3, title: '3333', content: '333333333333333' }
];

function PostDetail() {
  const { id } = useParams();  
  const post = examplePosts.find((post) => post.id === parseInt(id));
//   const navigate = useNavigate(); // ++++++ 나중에 필요할거같아서

  if (!post) {
    return <p>게시글 못 찾음</p>;
  }

//   const handleEdit = () => {
//     navigate(`/post/edit/${id}`);
//   };

//   const handleDelete = () => {
//     if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
//       console.log('게시글 삭제:', id);
//       navigate('/'); 
//     }
//   };

//   const handleRecommend = () => {
//     console.log('게시글 추천:', id);
//   };

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <div>
        <button /*onClick={handleEdit}*/>수정</button>
        <button /*onClick={handleDelete}*/>삭제</button>
        <button /*onClick={handleRecommend}*/>추천</button>
      </div>
    </div>
  );
}

export default PostDetail;