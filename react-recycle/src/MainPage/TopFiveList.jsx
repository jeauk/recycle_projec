import { useEffect, useState } from "react";
import Slider from "react-slick";
import styles from "../styles/TopFiveList.module.css";  // CSS 모듈을 import
import "../styles/TopFiveList.css";  // CSS 모듈을 import

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { Margin } from "@mui/icons-material";

const TopFiveList = () => {
    const myBackDomain = "http://localhost:8080";

    // 추천 게시판 데이터를 저장할 상태 정의
    const [recommendedBoards, setRecommendedBoards] = useState([]);
    const navigate = useNavigate();

    const imgClickHandler = (board) => {
        navigate(`/post/${board.id}`);
    };
    useEffect(() => {
        const loadRecommend = async () => {
            const url = myBackDomain + "/top5";
            try {
                const response = await fetch(url, {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();  // 받아온 데이터를 JSON으로 변환
                    setRecommendedBoards(data);  // 데이터를 상태에 저장
                } else {
                    console.error("Failed to fetch recommendations.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadRecommend(); // useEffect 실행 시 함수 호출
    }, []);  // 빈 배열을 의존성 배열로 주어 컴포넌트가 처음 렌더링될 때만 실행

    const clickHandler = ()=>{
        navigate('/list')
    }
    // react-slick 슬라이더 설정
    const settings = {
        dots: true,  // 하단에 점(dot) 네비게이션 표시
        infinite: true,  // 슬라이더가 무한 반복되도록 설정
        speed: 500,  // 슬라이더 전환 속도
        slidesToShow: 2.5,  // 한 번에 2.5개의 슬라이드를 보여줌
        slidesToScroll: 1,  // 한 번에 넘어가는 슬라이드 수
        autoplay: true,  // 자동 재생
        autoplaySpeed: 6000,  // 6초마다 자동 슬라이드
        arrows: true,  // 좌우 화살표를 통한 슬라이드 제어
    };

    return (
        <div style={{display: 'block'}}>
            {/* 제목과 더보기를 한 줄에 맞추고, 아랫부분을 기준으로 정렬 */}
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>인기 리폼게시글</h2>
                <p className={styles.more} onClick={clickHandler}>더보기</p>
            </div>
            <Slider {...settings} style={{display: 'grid', width: '82%', margin:'30px auto'}}>
                    {recommendedBoards.map((board) => (

                    <div key={board.id} className={styles.slide}>
                        <img 
                            src={board.imagePath} 
                            alt={board.title} 
                            className={styles.boardImage} 
                            onClick={() => imgClickHandler(board)} // 클릭 시 board 데이터 전달
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default TopFiveList;
