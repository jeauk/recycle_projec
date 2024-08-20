import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Nav />
          <Routes>
            <Route index element={<Home />} />
          </Routes>
        <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App;
