import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 로그인 상태를 확인
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 상태를 true로 변경
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 상태를 false로 변경
    sessionStorage.removeItem("jwt"); // JWT 삭제
  };

  return (
    <div className="App">
    </div>
  );
}

export default App;
