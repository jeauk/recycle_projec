import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginHandler = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        // 카카오 인증 서버에서 토큰 발급
        const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: 'dcedd1709d6d717e342a5c8ecea26356', // 카카오 REST API 키
            redirect_uri: 'http://localhost:3000/login/oauth2/callback/kakao', // 등록된 Redirect URI
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok) {
          // 액세스 토큰을 로컬 스토리지에 저장
          const accessToken = tokenData.access_token;
          localStorage.setItem("accessToken", accessToken);

          // 액세스 토큰을 사용하여 사용자 정보 요청
          const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          });

          const userData = await userResponse.json();

          if (userResponse.ok) {
            // 필요한 정보만 추출
            const { nickname } = userData.properties;
            const { email } = userData.kakao_account;
            const profileImageUrl = userData.properties.profile_image;

            // 사용자 정보를 Spring Boot 서버로 전송
            const response = await fetch("http://localhost:8080/api/save-user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nickname,
                email,
                profileImageUrl,
              }), // 사용자 정보를 JSON으로 변환하여 전송
            });

            const resData = await response.json();
            
            if (response.ok) {
              alert("로그인 성공: " + resData.message);
              navigate("/"); // 정보 확인 후 홈 페이지로 리디렉션
            } else {
              alert("로그인 실패: " + resData.message);
            }
            
          } else {
            alert("사용자 정보를 가져오는 데 실패했습니다.");
            console.error("사용자 정보를 가져오는 데 실패했습니다.", userData);
          }

        } else {
          alert("로그인 실패: " + tokenData.error_description || "알 수 없는 오류가 발생했습니다.");
          console.error("로그인 실패:", tokenData);
        }
      } catch (error) {
        alert("로그인 중 오류가 발생했습니다: " + error.message);
        console.error("로그인 중 오류가 발생했습니다:", error);
      }
    };

    if (code) {
      kakaoLogin();
    }
  }, [navigate, code]);

  return (
    <div className="LoginHandler">
      <div className="notice">
        <p>로그인 중입니다.</p>
        <p>잠시만 기다려주세요.</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoginHandler;
