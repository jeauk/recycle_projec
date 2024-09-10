import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({onLogout}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // JWT 삭제
    sessionStorage.removeItem("jwt");

    onLogout(); //상태 업데이트

    // 로그아웃 후 사용자 리다이렉트
    alert("로그아웃 되었습니다.");
    navigate("/"); // 메인 페이지로 리다이렉트
  };

  return (
    <button onClick={handleLogout} className="logoutbtn">
      로그아웃
    </button>
  );
};

export default Logout;
