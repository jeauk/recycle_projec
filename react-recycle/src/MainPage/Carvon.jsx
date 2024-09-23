import React from 'react';
import styles from '../styles/Carvon.module.css'; // CSS 모듈 불러오기
import { useNavigate } from 'react-router-dom';

const Carvon = () => {
    const navigate = useNavigate();

    // 각 버튼에 대한 클릭 핸들러 설정
    const handleNavigate = (path) => {
        navigate(path); // 내부 경로로 이동
    };

    return (
        <div>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>포인트로 환경도 지키고 보상도 받아요!</h1>
            </div>
            <div className={styles.container}>
                <div className={styles.box}>
                    <h2>탄소중립포인트, 무엇인가요?</h2>
                    <button 
                        className={styles.button}
                        onClick={() => handleNavigate('/carvon/drafting')} // 내부 경로 설정
                    >
                        <span>자세히 알아보기</span>
                    </button>
                </div>
                <div className={styles.box}>
                    <h2>탄소중립포인트로 받을 수 있는 혜택</h2>
                    <button 
                        className={styles.button}
                        onClick={() => handleNavigate('/carvon/incentive')} // 내부 경로 설정
                    >
                        <span>혜택 확인하기</span>
                    </button>
                </div>
                <div className={styles.box}>
                    <h2>탄소중립포인트 참여는 어떻게 하나요?</h2>
                    <button 
                        className={styles.button}
                        onClick={() => handleNavigate('/carvon/carvonMethod')} // 내부 경로 설정
                    >
                        <span>참여 방법 알아보기</span>
                    </button>
                </div>
                <div className={styles.box}>
                    <h2>탄소중립포인트에 참여하는 기업들</h2>
                    <button 
                        className={styles.button}
                        onClick={() => handleNavigate('/carvon/companyList')} // 내부 경로 설정
                    >
                        <span>참여 기업 보기</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carvon;
