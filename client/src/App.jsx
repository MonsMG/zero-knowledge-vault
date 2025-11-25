import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateSecret from './components/CreateSecret';
import ReadSecret from './components/ReadSecret';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateSecret />} />
        <Route path="/secret/:id" element={<ReadSecret />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;