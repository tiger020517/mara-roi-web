import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // [핵심] 로그인 모드인지, 회원가입 모드인지 구분하는 스위치
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    if (isSignUpMode) {
      // === 회원가입 처리 ===
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: email.split('@')[0] },
        },
      });
      if (error) alert('가입 실패: ' + error.message);
      else {
        alert('가입 환영합니다! 로그인 되었습니다.');
        navigate('/');
      }
    } else {
      // === 로그인 처리 ===
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert('로그인 실패: ' + error.message);
      else {
        alert('로그인 성공!');
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUpMode ? '회원가입' : '로그인'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자리 이상"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? '처리 중...' : (isSignUpMode ? '가입하기' : '로그인')}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        {isSignUpMode ? '이미 계정이 있으신가요? ' : '아직 계정이 없으신가요? '}
        <button 
          type="button"
          onClick={() => setIsSignUpMode(!isSignUpMode)} 
          className="font-bold underline text-black hover:text-gray-700"
        >
          {isSignUpMode ? '로그인으로 전환' : '회원가입으로 전환'}
        </button>
      </div>
    </div>
  );
}