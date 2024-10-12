import React from 'react';
import styles from '../styles/Card.module.css'; // CSS 모듈 불러오기
import { useNavigate } from 'react-router-dom';

const Card = () => {
    const navigate = useNavigate();
    
    const features = [
        {
            icon: "./img/camera.png",
            title: 'AI 분류 서비스',
            description: 'AI로 폐기물과 재활용품을 자동 분류합니다.',
            path: '/ai', // 이동할 경로 추가
        },
        {
            icon: './img/map.png',
            title: `중고/재활용 정보`,
            description: '중고 가게와 재활용 가게 정보를 제공합니다.',
            path: '/map', // 이동할 경로 추가
        },
        {
            icon: './img/phone.png',
            title: '폐기물 연락처',
            description: '지역별 폐기물 처리 연락처를 확인하세요.',
            path: '/sido', // 이동할 경로 추가
        },
        {
            icon: './img/note.png',
            title: '리폼 아이디어',
            description: '리폼 아이디어를 공유하고 확인하세요.',
            path: '/list', // 이동할 경로 추가
        },
    ];
    
    return (
        <>
            <h2 className={styles.tS}>주요 서비스</h2>
            <div className={styles.cardContainer}>
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className={styles.card} 
                        onClick={() => navigate(feature.path)} // 카드 클릭 시 이동
                    >
                        <div className={styles.iconWrapper}>
                            <img src={feature.icon} alt={feature.title} className={styles.icon} />
                        </div>
                        <h2 className={styles.title}>{feature.title}</h2>
                        <p className={styles.description}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Card;
