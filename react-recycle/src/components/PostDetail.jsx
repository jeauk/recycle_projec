import { useNavigate } from "react-router-dom";



const PostDetail=()=> {

  const navigate = useNavigate();



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
