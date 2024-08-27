import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Footer from './components/Footer';
import KakaoMap from './components/KakaoMap';
import TopHeader from './components/TopHeader';
import Login from './components/Login';
import styles from './App.module.css';

function App() {
  return (
    <div className="App">
      <div className={styles.appContainer}>
        <BrowserRouter>
          <TopHeader />
          <Nav />
          <div className={styles.mainContent}>
            <Routes>
              <Route index element={<Home />} />
              <Route path='/map' element={<KakaoMap />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
