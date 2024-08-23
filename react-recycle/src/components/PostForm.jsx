import { useNavigate } from "react-router-dom";


function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // bbbbbbbbbbbbbbbbbb

  const navigate = useNavigate();


 

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // 이미지 핸들러 함수
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


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
