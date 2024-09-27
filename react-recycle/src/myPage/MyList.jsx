import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyList = () => {
  const [page, setPage] = useState(1); // 기본 페이지를 1로 설정
  const [totalPages, setTotalPages] = useState(10); // 총 페이지 수 기본값 설정
  const [posts, setPosts] = useState([]); // 게시글 목록을 저장할 상태
  const navigate = useNavigate();
  const myBackDomain = process.env.REACT_APP_DOMAIN;

  // 서버에서 게시글 목록을 가져오는 함수
  const loadMyList = async () => {
    try {
      const jwt = sessionStorage.getItem("jwt");
      const url = myBackDomain+`/mypage/mylist?page=${page}&size=10`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error("데이터를 불러오는데 실패했습니다.");
      }

      const data = await response.json();

      // 서버에서 받아온 게시글 목록과 총 페이지 수를 상태에 저장
      setPosts(data.userPosts); // 게시글 목록 설정
      setTotalPages(data.totalPages); // 총 페이지 수 설정
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  // 페이지가 변경될 때마다 데이터를 다시 불러옴
  useEffect(() => {
    loadMyList();
  }, [page]); // page가 변경될 때마다 호출


  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // 클릭한 게시글의 상세 페이지로 이동
  };


  return (
    <div>
      <h1>게시판</h1>
      <ul style={{ padding: 0, listStyleType: "none" }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li

               onClick={() => handlePostClick(post.postId)}
               key={post.postId}
               style={{
                width: "1047px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "10px 20px",
                borderBottom: "1px solid #ccc",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 2, fontSize: "1.2rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{post.title}</h3>
              </div>
              <div
                style={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.9rem",
                }}
              >
                <p style={{ margin: 0 }}>작성자: {post.nickname}</p>
              </div>
              <div
                style={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.9rem",
                }}
              >
                <p style={{ margin: 0 }}>작성일: {post.createAt}</p>
              </div>
              <div style={{ flex: 1, fontSize: "0.9rem" }}>
                <p style={{ margin: 0 }}>조회수: {post.viewCount}</p>
              </div>
              <div style={{ flex: 1, fontSize: "0.9rem" }}>
                <p style={{ margin: 0 }}>추천수: {post.recommendCount}</p>
              </div>
            </li>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </ul>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Pagination
          page={page} // 현재 페이지 번호 설정
          onChange={(e, value) => setPage(value)} // 페이지 변경 시 호출
          count={totalPages} // 서버에서 받아온 총 페이지 수
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};

export default MyList;
