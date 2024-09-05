import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../components/UserContext";

const LoginHandler = ({onLogin}) => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const { fetchUserProfile } = useContext(UserContext);

  useEffect(() => {
    const sendCode = async () => {
      if (code) {
        try {
          const data = await fetch('http://localhost:8080/oauth/kakao/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          const res = await data.json();

            if (res.jwt) {
              sessionStorage.setItem("jwt", res.jwt);
              onLogin(); 
              await fetchUserProfile();
            }

          const jwt = sessionStorage.getItem("jwt");

          const res2 = await fetch('http://localhost:8080/parseJwt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ jwt }) // POST 요청에 JWT 포함
          });

          const data2 = await res2.json();
          console.log('서버 응답:', data2);

          // 로그인 성공 시 알림 표시
          alert('로그인에 성공했습니다!');
          navigate('/mypage');
        } catch (error) {
          console.error('에러 발생:', error);
          alert('로그인에 실패했습니다. 다시 시도해 주세요.');
          navigate('/mypage'); 
        }
      }
    };

    sendCode();
  }, [code, onLogin, navigate, fetchUserProfile]);

  return (
    <div className="LoginHandler">
      <p>로그인 중입니다. 잠시만 기다려주세요.</p>
    </div>
  );
};

export default LoginHandler;
