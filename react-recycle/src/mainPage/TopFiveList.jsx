import { useEffect, useState } from "react";
import styles from "../styles/TopFiveList.module.css";  // CSS 모듈을 import

import { useNavigate } from "react-router-dom";

const TopFiveList = () => {
    const myBackDomain = "https://trashformer.site";

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

    return (
        <div style={{display: 'block'}}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>인기 리폼 게시글</h2>
                <p className={styles.more} onClick={clickHandler}>더 보기</p>
            </div>
            <div className={styles.viewContainer}>
                <div className={styles.imgContainer}>
                    <img src="/img/aa.jpeg" alt="test" />
                </div>
                <div className={styles.textContainer}>
                    <div className={styles.TFTitle}>제목</div>
                    <div className={styles.TFContents}>내용</div>
                </div>
            </div>
            
            
            
            
            
            
            {/* <div className={styles.titleContainer}>
                <h2 className={styles.title}>인기 리폼게시글</h2>
                <p className={styles.more} onClick={clickHandler}>더보기</p>
            </div>
            <Slider {...settings} className={styles.topFiveSliders} style={{display: 'grid',}}>
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
            </Slider> */}
        </div>
    );
};

export default TopFiveList;
