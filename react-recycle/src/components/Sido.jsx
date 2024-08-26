import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Sido() {

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [townOptions, setTownOptions] = useState([]);
  const navigate = useNavigate();
  const [change, setChange] = useState(false);
  const [sido, setSido] = useState([]);

  useEffect(() => {
    async function get() {
      // const url = 'http://127.0.0.1:8080/sido';
      // const res = await fetch(url);
      // const data = await res.json();
      // setSido(data);

      const data2 = await fetch('http://localhost:8080/sido', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const res2 = await data2.json();
      console.log('서버 응답:', res2);
    }
    get();
  }, [])

  const towns = {
    강원도: ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'],
    경기도: ['가평군', '고양시', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시', '수원시', '시흥시', '안산시', '안성시', '안양시', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시', '의왕시', '의정부시', '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
    경상남도: ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시', '통영시', '하동군', '함안군', '함양군', '합천군'],
    경상북도: ['경산시', '경주시', '고령군', '구미시', '군위군', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시'],
    광주광역시: ['광산구', '남구', '동구', '북구', '서구'],
    대구광역시: ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    대전광역시: ['대덕구', '동구', '서구', '유성구', '중구'],
    부산광역시: ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'],
    서울특별시: ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    세종특별자치시: ['세종특별자치시'],
    울산광역시: ['남구', '동구', '북구', '울주군', '중구'],
    인천광역시: ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
    전라남도: ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
    전라북도: ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군'],
    제주특별자치도: ['서귀포시', '제주시'],
    충청남도: ['계룡시', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시', '청양군', '태안군', '홍성군'],
    충청북도: ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '증평군', '진천군', '청주시', '충주시'],
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

  const handleTownChange = (e) => {
    const town = e.target.value;
    setSelectedTown(town);
  }

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
      <select name="town" id="town" className="type02" value={selectedTown} onChange={handleTownChange}>
        <option value="">시·군·구</option>
        {townOptions.map((town, index) => (
          <option key={index} value={town}>
            {town}
          </option>
        ))}
      </select>
      <button onClick={get()}>제출</button>
      <button onClick={() => {navigate('/');}}>돌아가자~</button>
    </div>
  );
}

export default Sido;