import React, { useEffect, useState } from 'react';
import styles from '../styles/CompanyList.module.css';

const CompanyList = () => {
  const [companyData, setCompanyData] = useState([]);

  // 데이터를 비동기로 가져오는 함수
  const fetchCompanyData = async () => {
    try {
      const response = await fetch('http://localhost:8080/carvon/companyList');
      const data = await response.json();
      setCompanyData(data); // 응답 데이터를 상태로 저장
    } catch (error) {
      console.error('Error fetching data:', error); // 에러 처리
    }
  };

  useEffect(() => {
    fetchCompanyData(); // 컴포넌트가 처음 렌더링될 때 데이터 요청
  }, []);

  return (
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
  );
};

export default CompanyList;
