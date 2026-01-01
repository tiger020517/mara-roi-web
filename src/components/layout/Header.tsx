import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';

export default function Header() {
  const { user, signOut } = useAuth(); // 우리가 만든 로그인 방송국에서 정보 가져오기
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      {/* 로고 영역 */}
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-xl font-bold">
          브엘라해로이 & 마라의샘
        </Link>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex gap-6 text-sm font-medium">
        <Link to="/shop" className="hover:text-blue-600">SHOP (브엘라해로이)</Link>
        <Link to="/ministry" className="hover:text-blue-600">MINISTRY (마라의샘)</Link>
      </nav>

      {/* 우측 로그인/마이페이지 영역 */}
      <div className="flex gap-4 text-sm items-center">
        {user ? (
          <>
            {/* 로그인 했을 때 보일 화면 */}
            <span className="text-gray-500">{user.user_metadata.full_name || '회원'}님</span>
            <Link to="/cart" className="hover:underline">장바구니</Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              로그아웃
            </button>
          </>
        ) : (
          <>
            {/* 로그인 안 했을 때 보일 화면 */}
            <Link to="/login" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              로그인
            </Link>
          </>
        )}
      </div>
    </header>
  );
}