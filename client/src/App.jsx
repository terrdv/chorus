import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SongPage from './pages/SongPage';
import './css/App.css';
function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/song/:songId' element={<SongPage />} />
      </Routes> 
    </div>
  );
}

export default App;