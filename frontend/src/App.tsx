import { Route, Routes, Navigate } from 'react-router-dom';
import HeatMapPage from './pages/HeatMapPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HeatMapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
