'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  menu: {
    name: string;
    restaurant: {
      name: string;
    };
  };
}

interface Order {
  id: number;
  totalPrice: number;
  status: string; // '접수' | '배달중' | '완료'
  createdAt: string;
  orderItems: OrderItem[];
}

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        // 비로그인 상태일 경우 메인으로 이동
        if (res.status === 401) {
          alert('로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('주문 내역 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 주문 상태 시뮬레이션 토글 함수 (가산점 및 시연용 핵심 개발자 도구!)
  const simulateStatusChange = async (orderId: number, currentStatus: string) => {
    let nextStatus = '접수';
    if (currentStatus === '접수') nextStatus = '배달중';
    else if (currentStatus === '배달중') nextStatus = '완료';
    else if (currentStatus === '완료') nextStatus = '접수';

    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        // 성공 시 로컬 상태 갱신
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: nextStatus } : order
          )
        );
      } else {
        alert('주문 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>주문 내역을 불러오는 중입니다...</h2>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: '800px' }}>
      <div style={{ margin: '2rem 0 3rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          🧾 내 주문 내역
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          지금까지 주문한 영수증과 현재 배달 진행 상태를 실시간으로 확인할 수 있습니다.
        </p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '3rem' }}>📭</span>
          <h3 style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>주문한 내역이 존재하지 않습니다.</h3>
        </div>
      ) : (
        orders.map((order) => {
          // 주문 정보 내 첫 번째 메뉴에서 식당 이름을 대표로 추출
          const restaurantName = order.orderItems[0]?.menu.restaurant.name || '식당 정보 없음';
          const formattedDate = new Date(order.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div key={order.id} className="order-history-card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div className="order-header">
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {restaurantName}
                  </h3>
                  <span className="order-date">{formattedDate}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* 상태 뱃지 */}
                  <span className={`order-status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                  
                  {/* 시뮬레이션 버튼 (시연 영상 및 과제용 핵심 치트 기능!) */}
                  <button
                    onClick={() => simulateStatusChange(order.id, order.status)}
                    disabled={updatingId === order.id}
                    className="btn btn-secondary"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                  >
                    {updatingId === order.id ? '변경 중...' : '⚙️ 상태 변경 시뮬'}
                  </button>
                </div>
              </div>

              {/* 주문 품목 리스트 */}
              <div className="order-items-list">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <span style={{ color: 'var(--text-muted)' }}>
                      • {item.menu.name} <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>({item.quantity}개)</span>
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              {/* 영수증 하단 총합 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>주문 번호: #{order.id}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  총 <span style={{ color: 'var(--primary)' }}>{order.totalPrice.toLocaleString()}원</span>
                </span>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}
