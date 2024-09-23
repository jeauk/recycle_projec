import React from 'react';
import styles from '../styles/Paticipate.module.css';

const Participate = () => {
  const steps = [
    {
        number: "01",
        icon: "/img/participation_icon01.png", // 아이콘 경로 설정
        title: "탄소중립포인트 회원가입",
    },
    {
        number: "02",
        icon: "/img/participation_icon02.png",
        title: "실천항목별 참여방법\n<매뉴얼게시판>참고",
    },
    {
        number: "03",
        icon: "/img/participation_icon03.png",
        title: "녹색생활 실천활동",
    },
    {
        number: "04",
        icon: "/img/participation_icon04.png",
        title: "포인트 적립",
    },
    {
        number: "05",
        icon: "/img/participation_icon05.png",
        title: "인센티브 수령",
    },
];

return (
    <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
            <div key={index} className={styles.step}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepIcon}>
                    <img src={step.icon} alt={`Step ${step.number}`} />
                </div>
                <div className={styles.stepTitle}>
                    {step.title.split("\n").map((line, idx) => (
                        <span key={idx}>{line}<br/></span>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
};

export default Participate;
