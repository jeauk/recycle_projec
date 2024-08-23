import React, { useState } from "react";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 사용자의 JWT 토큰을 가져옵니다. (사용자가 로그인한 상태여야 합니다)
  const jwt = sessionStorage.getItem("jwt");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 작성된 게시물 정보를 담는 객체
    const postData = {
      title: title,
      content: content,
    };

    try {
      // 서버로 POST 요청을 보냅니다.
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`, // JWT 토큰을 Authorization 헤더에 포함하여 전송
        },
        body: JSON.stringify(postData), // title과 content를 JSON으로 전송
      });

      if (!response.ok) {
        throw new Error("게시물을 업로드하는 데 실패했습니다.");
      }

      const result = await response.json();
      alert("게시물이 성공적으로 업로드되었습니다!");
      console.log("서버 응답:", result);
    } catch (error) {
      console.error("에러 발생:", error);
      alert("게시물 업로드 중 문제가 발생했습니다.");
    }
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
      <button type="submit">올리기</button>
    </form>
  );
};

export default PostForm;
