import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';
import KakaoMap from './components/KakaoMap';
import TopHeader from './components/TopHeader';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopHeader />
        <Nav />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/map' element={<KakaoMap />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
