import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginHandler = ({onLogin}) => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  const myBackDomain = 'http://trashformer.site:8080';

  useEffect(() => {
    const sendCode = async () => {
      if (code) {
        try {
          const data = await fetch(myBackDomain+'/oauth/kakao/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });

          const res = await data.json();

            if (res.jwt) {
              sessionStorage.setItem("jwt", res.jwt);
              onLogin(); 
            }

          const jwt = sessionStorage.getItem("jwt");

          const res2 = await fetch(myBackDomain+'/parseJwt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ jwt }) // POST 요청에 JWT 포함
          });

          const data2 = await res2.json();

          // 로그인 성공 시 알림 표시
          navigate('/mypage');
          window.location.reload();
        } catch (error) {
          console.error('에러 발생:', error);
          alert('로그인에 실패했습니다. 다시 시도해 주세요.');
          navigate('/mypage'); 
        }
      }
    };

    sendCode();
  }, []);

  return (
    <div className="LoginHandler">
      <p>로그인 중입니다. 잠시만 기다려주세요.</p>
    </div>
  );
};

export default LoginHandler;
