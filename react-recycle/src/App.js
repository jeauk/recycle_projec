import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./mainPage/Home";
import KakaoMap from "./vendingDevice/KakaoMap";
import PostList from "./reformBoard/PostList";
import PostForm from "./reformBoard/PostForm";
import PostDetail from "./reformBoard/PostDetail";
import PostEdit from "./reformBoard/PostEdit";
import Footer from "./components/Footer";
import styles from './App.module.css';
import MainRecycleDetail from './mainRecycle/MainRecycleDetail';
import LoginHandeler from './myPage/LoginHandeler';
import Mypage from './myPage/MyPage';
import Sido from './sido/Sido';
import "./App.css";
import ReMap from "./reMap/ReMap";
import Contact from "./components/Contact";
import MyList from "./myPage/MyList";
import MyRecommend from "./myPage/MyRecommend";
import VendingDeviceMap from "./vendingDevice/VendingDeviceMap";
import CompanyList from "./carvon/CompanyList";
import Drafting from "./carvon/Drafting";
import Incentive from "./carvon/Incentive";
import OX from "./oxQuiz/OX";
import CarvonMethod from "./carvon/CarvonMethod";
import ScrollToTop from "./components/ScrollToTop";
import AiMainPage from "./ai/AiMainPage";

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
    sessionStorage.removeItem("jwt");
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
  };

  return (
    <div className="App">
      <div className={styles.appContainer}>
        <BrowserRouter>
          <ScrollToTop />
          <Nav isLoggedIn={isLoggedIn} onLogout={handleLogout} /> {/* 로그인 상태를 Nav에 전달 */}
          <Routes>
            <Route path="/sido" element={<Sido />} />
          </Routes>
          <div className={styles.mainContent}>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/map' element={<KakaoMap />} />
              <Route path='/recycleMain/:id' element={<MainRecycleDetail />} />
              <Route path='/sumap' element={<VendingDeviceMap />} />
              <Route path="/remap" element={<ReMap />} />
              <Route path="/list" element={<PostList />} />
              <Route path="/post" element={<PostForm />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/edit/:id" element={<PostEdit />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/mypage/mylist" element={isLoggedIn ? <MyList /> : <Navigate to="/" />} />
              <Route path="/mypage/myrecommend" element={isLoggedIn ? <MyRecommend /> : <Navigate to="/" />} />
              <Route path="/carvon/companyList" element={<CompanyList />} />
              <Route path="/carvon/drafting" element={<Drafting />} />
              <Route path="/carvon/incentive" element={<Incentive />} />
              <Route path="/carvon/carvonMethod" element={<CarvonMethod />} />
              <Route path="/mainRecycleDetail" element={<MainRecycleDetail />} />
              <Route path="/oxquiz" element={<OX />} />
              <Route path="/ai" element={<AiMainPage />} />
              <Route
                path="/login/oauth2/callback/kakao"
                element={<LoginHandeler onLogin={handleLogin} />}
              />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
