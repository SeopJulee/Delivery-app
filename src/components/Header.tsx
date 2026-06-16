'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const router = useRouter();
  const { cart, totalPrice, totalItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 로그인된 유저 세션 가져오기
  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('세션 로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchSession();

    // 로그인 이벤트 수신용 이벤트 리스너 추가 (로그인 완료시 헤더 갱신용)
    const handleAuthChange = () => {
      fetchSession();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  // 2. 로그아웃 처리
  const handleLogout = async () => {
    if (!confirm('로그아웃 하시겠습니까?')) return;
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        clearCart(); // 로그아웃 시 장바구니 비우기
        alert('로그아웃 완료!');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  // 3. 주문하기 (Checkout)
  const handleCheckout = async () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      setIsCartOpen(false);
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      alert('장바구니가 비어 있습니다.');
      return;
    }

    const confirmOrder = confirm(`총 ${totalPrice.toLocaleString()}원 주문하시겠습니까?`);
    if (!confirmOrder) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            menuId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('주문이 정상적으로 완료되었습니다! 주문 내역으로 이동합니다.');
        clearCart();
        setIsCartOpen(false);
        router.push('/orders'); // 주문 내역 페이지로 이동
      } else {
        alert(data.error || '주문 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('주문 전송 실패:', error);
      alert('서버와의 통신이 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header>
        <div className="header-container">
          <Link href="/" className="logo">
            <span>바이브 배달</span> 🛵
          </Link>

          <div className="nav-links">
            <Link href="/" className="btn btn-secondary">
              🏠 홈
            </Link>
            
            {user ? (
              <>
                <Link href="/orders" className="btn btn-secondary">
                  🧾 주문 내역
                </Link>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong>님
                </span>
                <button onClick={handleLogout} className="btn btn-link">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary">
                  로그인
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  회원가입
                </Link>
              </>
            )}

            {/* 장바구니 버튼 */}
            <button onClick={() => setIsCartOpen(true)} className="btn btn-primary">
              🛒 장바구니 ({totalItems})
            </button>
          </div>
        </div>
      </header>

      {/* 장바구니 우측 Drawer 슬라이드 */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>장바구니 🛒</h3>
              <button onClick={() => setIsCartOpen(false)} className="qty-btn" style={{ width: '30px', height: '30px' }}>
                ✕
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-muted)' }}>
                  장바구니가 비어 있습니다.<br />메인 화면에서 맛있는 메뉴를 담아보세요!
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">
                        {item.price.toLocaleString()}원
                      </span>
                    </div>
                    <div className="cart-item-qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="qty-btn">
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="qty-btn" 
                        style={{ border: 'none', color: '#ff4d4d', marginLeft: '6px', backgroundColor: 'transparent' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>총 주문 금액</span>
                  <span style={{ color: 'var(--primary)' }}>
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
                <button 
                  onClick={handleCheckout} 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', justifyContent: 'center', fontSize: '1.05rem' }}
                >
                  {isSubmitting ? '주문 전송 중...' : '주문하기 🛵'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
