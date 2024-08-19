import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import './styles/adsform.css';
import Header from './components/Header';
import Nav from './components/Nav';
import Home from './components/Home';
import Pool from './components/Pool';
import Cat from './components/Cat';
import Cool from './components/Cool';
import Help from './components/Help';
import Login from './components/Login';
import Signup from './components/Signup';
import KakaoMap from './components/KakaoMap';
import Search from './components/Search';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Header />
          <Nav />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/pool' element={<Pool />} />
            <Route path='/map' element={<KakaoMap />} />
            <Route path='/cat' element={<Cat />} />
            <Route path='/cool' element={<Cool />} />
            <Route path='/help' element={<Help />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/search' element={<Search />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
