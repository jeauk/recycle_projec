import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import MainRecycleSearch from './mainRecycle/MainRecycleSearch';
import LoginHandeler from './myPage/LoginHandeler';
import Mypage from './myPage/MyPage';
import Sido from './sido/Sido';
import "./App.css";
import ReMap from "./reMap/ReMap";
import Contact from "./components/Contact";
import MyList from "./myPage/MyList";
import MyRecommend from "./myPage/MyRecommend";
import VendingDeviceMarker from "./vendingDevice/VendingDeviceMarker";
import VendingDeviceMap from "./vendingDevice/VendingDeviceMap";

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

  return (
    <div className="App">
      <div className={styles.appContainer}>
        <BrowserRouter>
          <Nav />
          <div className={styles.mainContent}>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/map' element={<KakaoMap />} />
              <Route path='/RecycleMain' element={<MainRecycleSearch />} />
              <Route path='/RecycleMain/:id' element={<MainRecycleDetail />} />
              <Route path='/sumap' element={<VendingDeviceMap />} />
              <Route path="/remap" element={<ReMap />} />
              <Route path="/list" element={<PostList />} />
              <Route path="/post" element={<PostForm />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/edit/:id" element={<PostEdit />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mypage/mylist" element={<MyList />} />
              <Route path="/mypage/myrecommend" element={<MyRecommend />} />
              <Route
                path="/login/oauth2/callback/kakao"
                element={<LoginHandeler onLogin={handleLogin} />}
              />
              <Route path="/sido" element={<Sido />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
