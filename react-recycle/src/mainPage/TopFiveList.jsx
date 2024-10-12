import { useEffect, useState } from "react";
import styles from "../styles/TopFiveList.module.css";  // CSS 모듈을 import
import { useNavigate } from "react-router-dom";

const TopFiveList = () => {
    const myBackDomain = "http://localhost:8080"; // 백엔드 도메인
    const [recommendedBoards, setRecommendedBoards] = useState([]); // 추천 게시글 상태 정의
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

    return (
        <div>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>인기 리폼 게시글</h2>
                <p className={styles.more} onClick={clickHandler}>더 보기</p>
            </div>

            <div className={styles.viewContainer}>
            <div className={styles.imgContainer}>
                    <img src="/img/aa.jpeg" alt="test" />
                </div>
                {/* 추천 게시글 데이터를 순회하면서 제목만 UI에 표시 */}
                {recommendedBoards.length > 0 ? (
                    recommendedBoards.map((board, index) => (
                        <div key={board.id} className={styles.textContainer}>
                            <div className={styles.TFTitle}>
                                {index + 1}. {board.title} {/* 순서와 제목 표시 */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>추천 게시글을 불러오는 중입니다...</p>
                )}
            </div>
        </div>
    );
};

export default TopFiveList;
