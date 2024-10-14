import React, { useState, useEffect } from 'react';
import styled from '../styles/Ox.module.css';

// 로컬 스토리지에서 맞춘 퀴즈 수 가져오기
const getLocalStorage = () => {
  const data = localStorage.getItem('quizCorrectCount');
  return data ? JSON.parse(data) : 0;
};

const OX = () => {
  const [quizIndex, setQuizIndex] = useState(0); // 현재 퀴즈 인덱스
  const [correctCount, setCorrectCount] = useState(0); // 맞춘 문제 수 초기화
  const [isCorrect, setIsCorrect] = useState(null); // 정답 여부 확인
  const [quizData, setQuizData] = useState([]); // 퀴즈 데이터
  const [explanation, setExplanation] = useState(''); // 오답 설명
  const [showNext, setShowNext] = useState(false); // '다음' 버튼 표시 여부
  const myBackDomain = "http://localhost:8080";

  // 로컬 스토리지 초기화 (처음 페이지 로드될 때)
  useEffect(() => {
    localStorage.removeItem('quizCorrectCount'); // 로컬 스토리지에서 맞춘 퀴즈 수 삭제
  }, []);

  // 퀴즈 데이터를 서버에서 가져오기
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(myBackDomain+'/api/quiz'); // API 호출
        const data = await response.json(); // 응답 데이터를 JSON으로 변환
        setQuizData(data); // 퀴즈 데이터를 상태에 저장
      } catch (error) {
        console.error('퀴즈 데이터를 불러오는 중 오류:', error);
      }
    };
    fetchQuizData();
  }, []);

  // 사용자가 답을 선택할 때 호출되는 함수
  const handleAnswer = (answer) => {
    const currentQuiz = quizData[quizIndex]; // 현재 퀴즈 가져오기
    const correctAnswer = currentQuiz.correctAnswer ? 'O' : 'X'; // 정답을 'O' 또는 'X'로 변환
    if (correctAnswer === answer) {
      setIsCorrect(true); // 정답일 때
      setCorrectCount(prev => {
        const newCount = prev + 1; // 맞힌 문제 수 증가
        localStorage.setItem('quizCorrectCount', JSON.stringify(newCount)); // 로컬 스토리지에 저장
        return newCount;
      });
      setExplanation('정답입니다!'); // 정답 메시지 설정
    } else {
      setIsCorrect(false); // 오답일 때
      setExplanation(currentQuiz.explanation); // 오답 설명 저장
    }
    setShowNext(true); // 다음 버튼 표시
  };

  // '다음' 버튼을 눌렀을 때 호출되는 함수
  const handleNext = () => {
    setQuizIndex(prev => prev + 1); // 다음 퀴즈로 이동
    setIsCorrect(null); // 정답 여부 초기화
    setExplanation(''); // 설명 초기화
    setShowNext(false); // 다음 버튼 숨김
  };

  // 퀴즈가 모두 끝났을 때 화면=====================================
  if (quizIndex >= quizData.length) {
    return (
      <div className={styled.quiz}>
        <h1>퀴즈 완료!</h1>
        <p>맞춘 문제 수: {correctCount}</p>
      </div>
    );
  }
  //================================================================


  //===============================================================
  return (
    <div className={styled.wrap}>
      {quizData.length > 0 && (
        <>
          <h3>{quizIndex + 1}번째 / 총 {quizData.length}문항</h3>
          <h1>{quizData[quizIndex].question}</h1>
          <button className={styled.obtn} onClick={() => handleAnswer('O')} disabled={showNext}>O</button>
          <button className={styled.xbtn} onClick={() => handleAnswer('X')} disabled={showNext}>X</button>
          
          {isCorrect !== null && <p className={styled.question}>{explanation}</p>}

          {showNext && <button className={styled.nbtn} onClick={handleNext}>다음</button>}
        </>
      )}
    </div>
  );
};
  //===============================================================

export default OX;
