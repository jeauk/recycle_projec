import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import './styles/adsform.css';
import Header from './components/Header';
import Nav from './components/Nav';
import Home from './components/Home';
import Pool from './components/Pool';
import Dog from './components/Dog';
import Cat from './components/Cat';
import Cool from './components/Cool';
import Help from './components/Help';

function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Header />
          <Nav />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/pool' element={<Pool />} />
            <Route path='/dog' element={<Dog />} />
            <Route path='/cat' element={<Cat />} />
            <Route path='/cool' element={<Cool />} />
            <Route path='/help' element={<Help />} />
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
