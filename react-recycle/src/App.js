import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Nav from './components/Nav';

function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Header />
          <Nav />

        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
