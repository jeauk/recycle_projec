import React from 'react';
import styles from '../styles/Circularltems.module.css'; // CSS 모듈 불러오기

const CircularItems = () => {
  const items = [
    {
      icon: '/img/incentive_icon02.png', // 아이콘 경로 설정
      title: '전자영수증',
      description: '종이영수증 대신 전자영수증을 이용',
    },
    {
      icon: '/img/incentive_icon07.png',
      title: '텀블러·다회용컵',
      description: '커피전문점에서 일회용컵 대신 다회용컵 이용',
    },
    {
      icon: '/img/incentive_icon10.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon03.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon01.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon04.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon05.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon09.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon08.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
    },
    {
      icon: '/img/incentive_icon06.png',
      title: '일회용컵',
      description: '일회용컵보증금 참여 매장에서 일회용컵 반납',
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
