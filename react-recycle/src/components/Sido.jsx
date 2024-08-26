import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Sido() {

  const [selectedCity, setSelectedCity] = useState('');
  const [townOptions, setTownOptions] = useState([]);
  const navigate = useNavigate();

  const towns = {
    강원도: ['춘천시', '원주시', '강릉시'],
    경기도: ['수원시', '고양시', '성남시'],
    경상남도: ['창원시', '김해시', '진주시'],
    경상북도: ['포항시', '구미시', '경주시'],
    광주광역시: ['동구', '서구', '남구'],
    대구광역시: ['중구', '동구', '서구'],
    대전광역시: ['동구', '중구', '서구'],
    부산광역시: ['중구', '서구', '동구'],
    서울특별시: ['종로구', '중구', '용산구'],
    세종특별자치시: ['조치원읍', '부강면', '연동면'],
    울산광역시: ['중구', '남구', '동구'],
    인천광역시: ['중구', '동구', '미추홀구'],
    전라남도: ['목포시', '여수시', '순천시'],
    전라북도: ['전주시', '군산시', '익산시'],
    제주특별자치도: ['제주시', '서귀포시'],
    충청남도: ['천안시', '공주시', '보령시'],
    충청북도: ['청주시', '충주시', '제천시'],
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);

    if (city !== '0' && towns[city]) {
      setTownOptions(towns[city]);
    } else {
      setTownOptions([]);
    }
  };

  return (
    <div id="sido">
      <h1>시도 테스트 편</h1>
      <select name="city" id="city" value={selectedCity} onChange={handleCityChange}>
        <option value="0">도·특별·광역시</option>
        <option value="강원도">강원도</option>
        <option value="경기도">경기도</option>
        <option value="경상남도">경상남도</option>
        <option value="경상북도">경상북도</option>
        <option value="광주광역시">광주광역시</option>
        <option value="대구광역시">대구광역시</option>
        <option value="대전광역시">대전광역시</option>
        <option value="부산광역시">부산광역시</option>
        <option value="서울특별시">서울특별시</option>
        <option value="세종특별자치시">세종특별자치시</option>
        <option value="울산광역시">울산광역시</option>
        <option value="인천광역시">인천광역시</option>
        <option value="전라남도">전라남도</option>
        <option value="전라북도">전라북도</option>
        <option value="제주특별자치도">제주특별자치도</option>
        <option value="충청남도">충청남도</option>
        <option value="충청북도">충청북도</option>
      </select>
      <select name="town" id="town" className="type02">
        <option value="">시·군·구</option>
        {townOptions.map((town, index) => (
          <option key={index} value={town}>
            {town}
          </option>
        ))}
      </select>
      <button onClick={() => {navigate('/');}}>돌아가자~</button>
    </div>
  );
}

export default Sido;