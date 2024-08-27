import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Home from './components/Home';
import Footer from './components/Footer';
import KakaoMap from './components/KakaoMap';
import TopHeader from './components/TopHeader';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopHeader />
        <Nav />
          <Routes style="flex: 1;">
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
