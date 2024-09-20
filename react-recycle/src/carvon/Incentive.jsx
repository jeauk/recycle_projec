import React from 'react';
import styles from '../styles/Incentive.module.css';

const Incentive = () => {
  const tableData = [
    { target: '실천 다짐금', unit: '5,000원/최초 1회', yearly: '-' },
    { target: '전자영수증 발급', unit: '100원 / 건', yearly: '-' },
    { target: '텀블러/다회용컵 이용', unit: '300원 / 개', yearly: '-' },
    { target: '의류/장난감 반납', unit: '200원 / 건', yearly: '-' },
    { target: '다회용기 이용', unit: '2,000원 / 회', yearly: '70,000원' },
    { target: '무공해차 대여', unit: '100원 / 1km', yearly: '-' },
    { target: '친환경상품 구매', unit: '1,000원 / 건', yearly: '-' },
    { target: '고품질 재활용 배출', unit: '100원 / 1kg', yearly: '-' },
    { target: '미래세대 실천상품', unit: '100원 / 건', yearly: '상품 및 상금' },
  ];

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.header}>녹색생활 실천활동에 따른 인센티브</h2>
      <div className={styles.subtitle}>
        <p>지급주체: 한국환경공단</p>
        <p>지급시기: 매 월말 지급</p>
      </div>
      <table className={styles.incentiveTable}>
        <thead>
          <tr>
            <th>대상</th>
            <th>단가</th>
            <th>상한액 / 년</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.target}</td>
              <td>{row.unit}</td>
              <td>{row.yearly}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.note}>
        * 인센티브 세부내용은 대상별 참여여건, 예산범위에 따라 달라질 수 있습니다.
      </p>
    </div>
  );
};

export default Incentive;
