import { useEffect, useState } from "react";
import styles from "../styles/TopFiveList.module.css";  // CSS 모듈을 import
import { useNavigate } from "react-router-dom";

const TopFiveList = () => {
    const myBackDomain = "http://localhost:8080"; // 백엔드 도메인
    const [recommendedBoards, setRecommendedBoards] = useState([]); // 추천 게시글 상태 정의
    const [currentImage, setCurrentImage] = useState(""); // 현재 표시할 이미지 경로, 초기값은 빈 문자열
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    useEffect(() => {
        const loadRecommend = async () => {
            const url = myBackDomain + "/top5"; // 백엔드 API URL
            try {
                const response = await fetch(url, {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json(); // 데이터를 JSON으로 변환
                    console.log(data); // 데이터를 확인하기 위해 출력
                    setRecommendedBoards(data); // 추천 게시글 상태에 저장
                    if (data.length > 0) {
                        setCurrentImage(data[0].imagePath); // 첫 번째 게시글의 이미지로 기본 이미지 설정
                    }
                } else {
                    console.error("Failed to fetch recommendations.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadRecommend(); // useEffect 실행 시 함수 호출
    }, []);  // 빈 배열로 설정하여 컴포넌트 첫 렌더링 시 한 번만 실행

    // 더 보기 클릭 시 list 페이지로 이동
    const clickHandler = () => {
        navigate('/list');
    };

    // 제목에 마우스를 올렸을 때 이미지 경로 업데이트
    const handleMouseEnter = (imagePath) => {
        setCurrentImage(imagePath);
    };

    // 제목 클릭 시 해당 게시글로 이동
    const handleTitleClick = (id) => {
        navigate(`/post/${id}`); // 게시글 ID를 기반으로 URL 생성 후 이동
    };

    return (
        <div>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>인기 리폼 게시글</h2>
                <p className={styles.more} onClick={clickHandler}>더 보기</p>
            </div>

            <div className={styles.viewContainer}>
                <div className={styles.imgContainer}>
                    <img src={currentImage} alt="게시글 이미지" />
                </div>

                {/* 추천 게시글을 한곳에 다 적기 */}
                {recommendedBoards.length > 0 ? (
                    <div className={styles.textContainer}>
                        <div className={styles.TFTitle}>
                            {recommendedBoards.map((board, index) => (
                                <p key={board.id}
                                   onMouseEnter={() => handleMouseEnter(board.imagePath)}
                                   onClick={() => handleTitleClick(board.id)} // 제목 클릭 시 이동
                                   style={{ cursor: 'pointer' }}>  {/* 마우스 포인터 변경 */}
                                    {index + 1}. {board.title}
                                </p>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>추천 게시글을 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
};

export default TopFiveList;
