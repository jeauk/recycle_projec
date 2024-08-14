import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';


function App() {
  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Header />

        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
