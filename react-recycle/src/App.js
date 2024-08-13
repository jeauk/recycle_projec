import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Kategorie from './components/Kategorie';

function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Nav />
          <Kategorie />

        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
