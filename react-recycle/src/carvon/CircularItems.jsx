import React from 'react';
import styles from '../styles/Circularltems.module.css'; // CSS 모듈 불러오기

const CircularItems = () => {
  const items = [
    {
      icon: '/img/incentive_icon02.png', // 아이콘 경로 설정
      title: '전자영수증',
      description: (<>종이영수증 대신<br />전자영수증을 이용</>),
    },
    {
      icon: '/img/incentive_icon07.png',
      title: '텀블러·다회용컵',
      description: (<>커피전문점에서<br />일회용컵 대신 다회용컵 이용</>),
    },
    {
      icon: '/img/incentive_icon10.png',
      title: '일회용컵',
      description: (<>일회용컵보증금 참여 매장에서<br />일회용컵 반납</>),
    },
    {
      icon: '/img/incentive_icon03.png',
      title: '리필스테이션',
      description: (<>세제, 화장품은 빈 용기를<br />가져가서 매장에서 리필</>),
    },
    {
      icon: '/img/incentive_icon01.png',
      title: '다회용기',
      description: (<>다회용기 사용을 선택하여<br />배달음식을 주문</>),
    },
    {
      icon: '/img/incentive_icon04.png',
      title: '무공해차',
      description: (<>차량공유업체 앱에서<br />무공해차를 대여</>),
    },
    {
      icon: '/img/incentive_icon05.png',
      title: '친환경제품',
      description: (<>친환경제품 판매 매장에서<br />친환경제품 구매</>),
    },
    {
      icon: '/img/incentive_icon09.png',
      title: '고품질 재활용품',
      description: (<>지자체 수거장에서<br />고품질 재활용품 배출</>),
    },
    {
      icon: '/img/incentive_icon08.png',
      title: '폐휴대폰',
      description: (<>사용하지 않는 폐휴대폰<br />기부·재활용 기업에 반납</>),
    },
    {
      icon: '/img/incentive_icon06.png',
      title: '미래세대 실천행동',
      description: (<>기후행동 1.5°C 앱에 가입 후<br />활동에 따라 포인트 적립</>),
    },
  ];

  return (
    <div>
      <div className={styles.container}>
        {items.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.icon}>
              <img src={item.icon} alt={item.title} />
            </div>
            <div className={styles.text}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularItems;
