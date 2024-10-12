import CircularItems from "./CircularItems";
import Participate from "./Participate";
import styles from "../styles/CarvonMethod.module.css";

const CarvonMethod = () => {
  const handleButtonClick = () => {
    window.location.href = 'https://www.cpoint.or.kr/netzero/main.do'; // 클릭 시 해당 URL로 이동
  };

  return (
    <div className={styles.wrap}>
      <button onClick={handleButtonClick} className={styles.topButton}>
        탄소중립포인트 하러가기
      </button>
      <h1 className={styles.h1}>참여방법 절차</h1>
      <Participate />
      <h1 className={styles.h1}>녹색생활 실천활동 참여방법</h1>
      <CircularItems />
      <h1 className={styles.h1}>참여시 유의 사항</h1>
      <ul>
        <li>전자영수증 : 제도 참여기업의 앱에서 '스마트 영수증 등 전자영수증 발급하기' 설정</li>
        <li>다회용기 : 일부 지역만 해당되므로 자세한 사항은 공지사항 참고</li>
        <li>무공해차대여 : 포인트 실적 해당일은 반납일 기준일임</li>
        <li>
          친환경제품 구매 : '그린카드(실물카드)'를 사용하여 에코머니 포인트가 100포인트 이상 적립 및 총 결제 금액이 <br />2,000원 이상 또는 '친환경제품 구매 참여기업'에서 결제 수단에 관계없이 2,000원 이상 친환경제품 구매
        </li>
        <li>미래세대 실천행동 : 한국기후환경네트워크의 「기후행동 1.5℃」 를 통해 참가(<a href="https://c-action.kr">https://c-action.kr</a>)</li>
      </ul>
    </div>
  );
};

export default CarvonMethod;
