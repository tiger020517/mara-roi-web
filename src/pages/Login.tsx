import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('로그인 실패: ' + error.message);
    } else {
      alert('로그인 성공!');
      navigate('/'); // 메인으로 이동
    }
    setLoading(false);
  };

  // 회원가입 처리
  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0], // 이메일 아이디를 닉네임으로 임시 저장
        },
      },
    });

    if (error) {
      alert('가입 실패: ' + error.message);
    } else {
      alert('회원가입 완료! 바로 로그인되었습니다.');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>로그인 / 회원가입</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자리 이상 입력"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? '처리 중...' : '로그인'}
        </button>
      </form>

      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button onClick={handleSignUp} disabled={loading} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
          아직 계정이 없으신가요? 회원가입
        </button>
      </div>
    </div>
  );
}