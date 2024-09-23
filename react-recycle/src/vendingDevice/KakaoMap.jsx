import map from '../styles/Map.module.css';
import { useNavigate } from 'react-router-dom';  // useNavigate import

const KakaoMap = () => {
    const navigate = useNavigate();  // useNavigate 훅 사용

    return (
        <div>
            <button className={map.btn1} onClick={() => { navigate('/sumap') }}>재활용 자판기</button>
            <button className={map.btn2} onClick={() => { navigate('/remap') }}>중고가게 위치</button>
            <div className={map.bgc}>
                <div className={map.super}></div>
            </div>
            <div className={map.bg}></div>
        </div>
    );
};

export default KakaoMap;
