import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글 목록을 가져오는 API 호출
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/postlist");
        if (!response.ok) {
          throw new Error("게시글을 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
      {posts.map((post) => (
        <Card
          key={post.id}
          sx={{ flexBasis: 'calc(25% - 16px)', maxWidth: 345 }} // 한 줄에 4개, 카드 간격 맞추기
          onClick={() => handlePostClick(post.id)}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              image={post.imagePath ? post.imagePath : "img/NOIMAGE.png"}
              sx={{ width: '100%', height: 200, objectFit: 'cover' }} // 카드의 너비에 맞춰 이미지 적용
              alt={"대표이미지"}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {post.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary'}}>
                <div className="imgContainer" style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar alt="Remy Sharp" src={post.authorImg} sx={{ width: 24, height: 24 }} />
                  {post.author}
                </div>
                {"조회수: "}{post.viewCount} {"추천수: "}{post.recommendCount}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
};

export default PostList;
