import React from 'react';
import styles from '../styles/Card.module.css'; // CSS 모듈 불러오기
import { useNavigate } from 'react-router-dom';

const Card = () => {
    const navigate = useNavigate();
    
    const features = [
        {
            icon: "./img/camera.png",
            title: 'AI 판독기',
            description: 'AI를 활용하여 폐기물 및 재활용품을 자동으로 판별해주는 서비스입니다. 정확하고 빠른 판독 결과로 효율적인 재활용이 가능합니다.',
            path: '/ai', // 이동할 경로 추가
        },
        {
            icon: './img/map.png',
            title: `중고 가게 / 재활용 기계`,
            description: '중고 물품 판매처와 재활용 기계에 대한 정보를 제공합니다. 사용하지 않는 물건을 효율적으로 처리하는 방법을 확인하세요.',
            path: '/map', // 이동할 경로 추가
        },
        {
            icon: './img/phone.png',
            title: '폐기물 시/군/구 별 전화번호',
            description: '각 지역별 폐기물 처리 담당 기관의 연락처를 제공합니다. 신속한 폐기물 처리를 위해 필요한 정보를 빠르게 찾아보세요.',
            path: '/sido', // 이동할 경로 추가
        },
        {
            icon: './img/note.png',
            title: '리폼 게시판',
            description: '낡은 물건들을 새롭게 변신시키는 리폼 아이디어를 공유하는 공간입니다. 창의적인 리폼 방법을 확인하고, 나만의 작품을 만들어보세요.',
            path: '/list', // 이동할 경로 추가
        },
    ];
    
    return (
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
    );
};

export default Card;
