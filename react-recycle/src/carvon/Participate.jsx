import React from 'react';
import styles from './Participate.module.css';

const Participate = () => {
  const steps = [
    {
      number: '01',
      icon: '/img/icon1.png', // 실제 아이콘 경로를 사용하세요
      title: '탄소중립포인트 회원가입',
    },
    {
      number: '02',
      icon: '/img/icon2.png',
      title: '실천항목별 참여방법 <매뉴얼게시판>참고',
    },
    {
      number: '03',
      icon: '/img/icon3.png',
      title: '녹색생활 실천활동',
    },
    {
      number: '04',
      icon: '/img/icon4.png',
      title: '포인트 적립',
    },
    {
      number: '05',
      icon: '/img/icon5.png',
      title: '인센티브 수령',z
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>참여방법 절차</h2>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <span className={styles.number}>{step.number}</span>
            <img src={step.icon} alt={`icon-${step.number}`} className={styles.icon} />
            <p className={styles.title}>{step.title}</p>
            {index < steps.length - 1 && <span className={styles.arrow}></span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participate;
