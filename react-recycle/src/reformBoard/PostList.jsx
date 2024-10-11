import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from "react-router-dom";
import { Avatar, Pagination } from "@mui/material";
import styles from '../styles/PostList.module.css';  // CSS Module import

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // 기본 페이지를 1로 설정
  const [totalPages, setTotalPages] = useState(10); // 총 페이지 수 기본값 설정
  const [search, setSearch] = useState(""); // 검색어 상태 추가
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 사용할 검색어 상태
  const [searchType, setSearchType] = useState("title_content"); // 검색 타입 상태 추가
  const navigate = useNavigate();
  const myBackDomain = "http://trashformer.site";

  // API 호출 함수 분리
  const fetchPosts = async (page, searchQuery, searchType) => {
    try {
      const query = searchQuery ? `&search=${encodeURIComponent(searchQuery)}&type=${searchType}` : "";
      const response = await fetch(
        myBackDomain+`/api/postlist?page=${page}&size=12${query}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (!response.ok) {
        throw new Error("게시글을 가져오는 데 실패했습니다.");
      }
      
      const data = await response.json();
      setPosts(data.posts); // 응답에서 게시글 목록 설정
      setTotalPages(data.totalPages); // 총 페이지 수 설정
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 페이지 및 검색어가 변경될 때마다 API 호출
  useEffect(() => {
    fetchPosts(page, searchQuery, searchType); // 검색 타입과 검색어, 페이지 정보를 전달
  }, [page, searchQuery, searchType]);

  // 검색어 입력 핸들러
  const searchChange = (e) => {
    setSearch(e.target.value); // 입력 필드에 입력된 값 상태로 저장
  };

  // 검색 버튼 클릭 시 호출
  const handleSearch = () => {
    setSearchQuery(search); // 검색어 상태를 업데이트하고 API 요청 트리거
    setPage(1); // 검색 시 페이지를 1로 초기화
  };

  // 검색 타입 변경 핸들러
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value); // 검색 타입을 상태로 저장
  };

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="big">
      <div className={styles.searchBox}>
        <select onChange={handleSearchTypeChange} value={searchType}> {/* 검색 타입 변경 핸들러 연결 */}
          <option value="title_content">내용+제목</option>
          <option value="title">제목</option>
          <option value="author">작성자</option>
        </select>
        <input
          onChange={searchChange} // 입력값 변경 시 상태 업데이트
          placeholder="검색 할 내용"
          value={search} // 상태 값을 input 필드에 연결
        />
        <button className={styles.searchButton} onClick={handleSearch}>검색</button> {/* 검색 버튼 클릭 시 handleSearch 호출 */}
      </div>
      
      <div className={styles.container}>
        {posts.map((post) => (
          <Card
            key={post.id}
            className={styles.card}
            onClick={() => handlePostClick(post.id)} // 카드 클릭 시 게시글 상세 페이지로 이동
          >
            <CardActionArea>
              <CardMedia
                component="img"
                image={post.imagePath}
                className={styles.cardMedia}
                alt={"대표이미지"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  <div className={styles.postListTitle}>
                    {post.title}
                  </div>
                </Typography>
                <Typography variant="body2" className={styles.typographyBody} component="div">
                  <div className={styles.imgContainer}>
                    <Avatar alt="Remy Sharp" src={post.authorImg} sx={{ width: 24, height: 24 }} />
                    <div className={styles.postListAuthorName}>
                      {post.author}
                    </div>
                  </div>
                  {"조회수: "}{post.viewCount} {"추천수: "}{post.recommendCount}
                  <div className={styles.postListDate}>
                    {post.createAt}
                    {post.updateChange && (
                      <span className={styles.updatedText}> (수정됨)</span>
                    )}
                  </div>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>

      <div className={styles.postingButton}>
        <button onClick={() => navigate("/post")}>글쓰기</button>
      </div>
      
      <div className={styles.paginationContainer}>
        <Pagination
          page={page} // 현재 페이지 번호를 설정
          onChange={(e, value) => setPage(value)} // 페이지 클릭 시 호출되는 함수
          count={totalPages} // 총 페이지 수를 서버에서 받아온 값으로 설정
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  );
};

export default PostList;
