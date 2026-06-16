'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 로그인 성공 알림 및 커스텀 이벤트 전송 (헤더 컴포넌트 실시간 갱신용)
        window.dispatchEvent(new Event('auth-change'));
        alert(`${data.user.name}님, 환영합니다!`);
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || '로그인 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
      <div className="auth-wrapper">
        <h2 className="auth-title">로그인 🛵</h2>

        {error && (
          <div style={{ backgroundColor: 'rgba(255, 77, 77, 0.15)', border: '1px solid rgba(255, 77, 77, 0.3)', color: '#ff4d4d', padding: '0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '1.2rem', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이메일 주소</label>
            <input
              type="email"
              className="form-input"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', justifyContent: 'center', marginTop: '1.5rem', fontSize: '1rem' }}
          >
            {isSubmitting ? '로그인 처리 중...' : '로그인'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          처음이신가요?{' '}
          <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            회원가입하기
          </Link>
        </div>
      </div>
    </main>
  );
}
