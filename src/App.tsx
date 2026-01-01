import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Layout from './components/layout/Layout'; // 레이아웃 가져오기

import Home from './pages/Home';
import Shop from './pages/Shop';
import Ministry from './pages/Ministry';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Layout으로 감싸진 라우트들 */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/ministry" element={<Ministry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<div>관리자페이지</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;