import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Outlet은 현재 주소에 맞는 페이지(Home, Shop 등)가 들어가는 구멍입니다 */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      
      {/* 푸터도 나중에 여기서 한 번만 만들면 됩니다 */}
      <footer className="p-4 text-center text-xs text-gray-400 border-t mt-10">
        © 2026 Beer Lahai Roi & Mara's Spring. All rights reserved.
      </footer>
    </div>
  );
}