import React, { useEffect } from 'react';
import styles from '../styles/Quiz.module.css'; // CSS 모듈 불러오기
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate('/oxquiz')
  }

  return (
    <div className={styles.quizWrap}>
      <div className={styles.side1}></div>
      <section className={styles.volunteerSection}>
        <div className={styles.imgContainer}>
          <img src='./img/trac.png' className={styles.joinButton} />
        </div>
        <div className={styles.textContainer}>
          <h1>재활용 <span className={styles.highlight}>퀴즈</span></h1>
          <p>
            "이건 재활용이 될까, 안 될까?" 평소에 고민했던 적 있나요?<br />
            당신의 재활용 상식은 몇 점일까요? 지금 바로 도전해서 재활용 천재가 되어보세요!
          </p>
          <button className={styles.qbtn} onClick={clickHandler}>퀴즈 풀기 →</button>
        </div>
      </section>
      <div className={styles.side2}></div>
    </div>
  );
};

export default Quiz;
