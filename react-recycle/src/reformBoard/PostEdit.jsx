import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PostEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoLink: '',
    steps: []
  });
  const [imageFile, setImageFile] = useState(null); // 메인 이미지 파일을 저장할 상태
  const [imagePreview, setImagePreview] = useState(''); // 메인 이미지 미리보기 URL
  const [stepImages, setStepImages] = useState([]); // 스텝 이미지 파일들을 저장할 상태
  const [stepImagePreviews, setStepImagePreviews] = useState([]); // 스텝 이미지 미리보기 URL

  const dataget = async () => {
    const jwt = sessionStorage.getItem('jwt');
    const url = `http://localhost:8080/edit/posts/${id}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${jwt}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setPost(data.post);
      setFormData({
        title: data.post.title,
        content: data.post.content,
        videoLink: data.post.videoLink,
        steps: data.post.steps || []
      });
      setStepImages(new Array(data.post.steps.length).fill(null)); // 스텝 이미지 파일 상태 초기화
      setStepImagePreviews(data.post.steps.map(step => step.imgUrl || '')); // 스텝 이미지 미리보기 URL 초기화
    } catch (error) {
      console.error('Error fetching post data:', error);
    }
  };

  useEffect(() => {
    dataget();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index].stepContent = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // 미리보기 URL 생성
  };

  const handleStepImageChange = (index, e) => {
    const file = e.target.files[0];
    const newStepImages = [...stepImages];
    const newStepImagePreviews = [...stepImagePreviews];

    newStepImages[index] = file;
    newStepImagePreviews[index] = URL.createObjectURL(file); // 스텝 이미지 미리보기 URL 생성

    setStepImages(newStepImages);
    setStepImagePreviews(newStepImagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jwt = sessionStorage.getItem('jwt');
    const url = `http://localhost:8080/edit/posts/${id}`;

    // FormData 객체 생성
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('videoLink', formData.videoLink);

    if (imageFile) {
      formDataToSend.append('imageFile', imageFile); // 메인 이미지 파일 추가
    }

    formData.steps.forEach((step, index) => {
      formDataToSend.append(`steps[${index}].stepContent`, step.stepContent);
      if (stepImages[index]) {
        formDataToSend.append(`steps[${index}].stepImage`, stepImages[index]); // 스텝 이미지 파일 추가
      } else {
        formDataToSend.append(`steps[${index}].imgUrl`, step.imgUrl); // 기존 스텝 이미지 URL 유지
      }
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      body: formDataToSend
    });

    if (response.ok) {
      navigate('/');
    } else {
      console.error('Failed to update post');
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <img src={imagePreview || post.imagePath || ''} alt="완성 사진" style={{ width: '100%', height: 'auto' }} />
        <input type="file" name="imageFile" onChange={handleImageChange} />
        <h1>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            style={{ width: '100%' }}
          />
        </h1>
        <p>
          작성자: {post.kakaoUserEntity.nickname}&nbsp;&nbsp;&nbsp;
          작성날짜: {post.createdAt}&nbsp;&nbsp;&nbsp;
          조회수: {post.viewCount}
        </p>
        <hr />
        <h2>내용 (재료)</h2>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          style={{ width: '100%', height: '100px' }}
        />
        <hr />
        <h2>동영상 링크</h2>
        <input
          type="text"
          name="videoLink"
          value={formData.videoLink}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        />
        <hr />
        <h2>스탭</h2>
        {formData.steps.map((step, index) => (
          <div key={index}>
            <h3>스탭 {index + 1}</h3>
            <textarea
              value={step.stepContent}
              onChange={(e) => handleStepChange(index, e.target.value)}
              style={{ width: '100%', height: '50px' }}
            />
            <img src={stepImagePreviews[index] || step.imgUrl || ''} alt="스탭 이미지" style={{ width: '100%', height: 'auto' }} />
            <input type="file" onChange={(e) => handleStepImageChange(index, e)} /> {/* 스탭 이미지 변경 필드 추가 */}
            <hr />
          </div>
        ))}
        <div>
          <button type="submit">완료</button>
          <button type="button" onClick={() => navigate('/')}>취소</button>
        </div>
      </div>
    </form>
  );
}

export default PostEdit;
