import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePortrait from './pages/CreatePortrait';
import RecordStory from './pages/RecordStory';
import SuccessShare from './pages/SuccessShare';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Navbar />
        <main className="container" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePortrait />} />
            <Route path="/record" element={<RecordStory />} />
            <Route path="/success" element={<SuccessShare />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
