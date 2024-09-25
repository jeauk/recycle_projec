import { KAKAO_AUTH_URL } from "./OAuth"


const Kakaobtn = ()=>{

    return(
    <a href={KAKAO_AUTH_URL} className="kakaobtn">
        <img src={'/img/kakao.png'} />
    </a>
    );
};

export default Kakaobtn;