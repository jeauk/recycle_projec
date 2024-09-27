import React, { useEffect, useState } from 'react';
import styles from '../styles/CompanyList.module.css';

const CompanyList = () => {
  const [companyData, setCompanyData] = useState([]);
  const myBackDomain = process.env.REACT_APP_DOMAIN;

  // 데이터를 비동기로 가져오는 함수
  const fetchCompanyData = async () => {
    try {
      const response = await fetch(myBackDomain+'/carvon/companyList');
      const data = await response.json();
      setCompanyData(data); // 응답 데이터를 상태로 저장
    } catch (error) {
      console.error('Error fetching data:', error); // 에러 처리
    }
  };

  useEffect(() => {
    fetchCompanyData(); // 컴포넌트가 처음 렌더링될 때 데이터 요청
  }, []);

  const handleButtonClick = () => {
    window.location.href = 'https://www.cpoint.or.kr/netzero/main.do'; // 클릭 시 해당 URL로 이동
  };

  return (
    <div>
      <button onClick={handleButtonClick} className={styles.topButton}>
        탄소중립포인트 하러가기
      </button>
      <div className={styles.grid}>
        {companyData.length > 0 ? (
          companyData.map((company, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.logoContainer}>
                <img src={company.imgSrc} alt={company.title} className={styles.logo} />
              </div>
              <h2 className={styles.title}>{company.title}</h2>
              <p className={styles.text}>{company.text}</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
