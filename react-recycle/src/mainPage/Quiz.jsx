import React, { useEffect } from 'react';
import styles from '../styles/Quiz.module.css'; // CSS 모듈 불러오기
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';  // AOS 스타일 불러오기

const Quiz = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 1000, // 애니메이션 지속 시간
        });
    }, []);

    const clickHandler = ()=>{
        navigate('/oxquiz')
    }


    return (
        <section className={styles.volunteerSection}>
        <div className={styles.textContainer}>
            <h1>재활용 <span className={styles.highlight}>퀴즈</span></h1>
            <p>
                "이건 재활용이 될까, 안 될까?" 평소에 고민했던 적 있나요? 당신의 재활용 상식은 몇 점일까요?
                지금 바로 도전해서 재활용 천재가 되어보세요! 매일 버리는 것들, 올바르게 재활용하고 있을까요?
                퀴즈 풀고 환경 지킴이가 될 기회를 놓치지 마세요! 과연 당신은 재활용 마스터일까요, 아니면 이제 시작하는 초보자일까요?
            </p>
        </div>
        <div className={styles.imgContainer}>
            <img src='./img/trac.png' className={styles.joinButton} data-aos="fade-down" onClick={clickHandler} />
        </div>
    </section>
    );
};

export default Quiz;
