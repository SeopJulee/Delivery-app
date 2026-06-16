'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

interface Menu {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  menus: Menu[];
}

export default function Home() {
  const { addToCart } = useCart();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2000);
  };

  // 식당 및 메뉴 목록 가져오기 (카테고리 필터 포함)
  const fetchRestaurants = async (category: string) => {
    setIsLoading(true);
    try {
      const query = category === '전체' ? '' : `?category=${encodeURIComponent(category)}`;
      const res = await fetch(`/api/restaurants${query}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
        
        // 카테고리를 바꿨을 때 이전에 선택된 식당이 필터된 목록에 없으면 선택 해제
        if (selectedRestaurant) {
          const stillExists = data.some((r: Restaurant) => r.id === selectedRestaurant.id);
          if (!stillExists) {
            setSelectedRestaurant(null);
          }
        }
      }
    } catch (error) {
      console.error('식당 데이터를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <main className="container">
      {/* 히어로 타이틀 */}
      <div style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.8rem' }}>
          부경대 맛집을 <span style={{ color: 'var(--primary)' }}>스마트하게</span> 주문하세요
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Next.js 풀스택 기술과 Neon DB로 작동하는 부경대학교 맞춤형 배달 서비스 '부경이츠'
        </p>
      </div>

      {/* 카테고리 탭 (가산점 기능) */}
      <div className="category-tabs">
        {['전체', '중식', '일식', '멕시칸'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`tab ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat === '전체' ? '🍔 전체보기' : cat === '중식' ? '🍜 중식' : cat === '일식' ? '🍣 일식' : '🌮 멕시칸'}
          </button>
        ))}
      </div>

      {/* 로딩 표시 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          식당 정보를 가져오는 중입니다...
        </div>
      ) : (
        <>
          {/* 식당 그리드 */}
          <div className="restaurant-grid">
            {restaurants.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                해당 카테고리의 식당이 존재하지 않습니다.
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant)}
                  className={`restaurant-card ${selectedRestaurant?.id === restaurant.id ? 'active' : ''}`}
                  style={selectedRestaurant?.id === restaurant.id ? { borderColor: 'var(--primary)' } : {}}
                >
                  <div className="card-img-wrapper">
                    <img src={restaurant.imageUrl} alt={restaurant.name} className="card-img" />
                    <span className="category-tag">{restaurant.category}</span>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{restaurant.name}</h3>
                    <p className="card-desc">{restaurant.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {selectedRestaurant?.id === restaurant.id ? '선택됨 ✓' : '메뉴 보기 ➜'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 선택한 식당의 메뉴 목록 (밑에 부드럽게 펼쳐짐) */}
          {selectedRestaurant && (
            <div id="menus-section" className="menu-section">
              <div className="menu-section-header">
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600 }}>
                    🍔 {selectedRestaurant.name} 메뉴판
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                    원하는 메뉴를 장바구니에 담아 주문을 진행해 보세요!
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  메뉴 닫기
                </button>
              </div>

              <div className="menu-grid">
                {selectedRestaurant.menus.map((menu) => (
                  <div key={menu.id} className="menu-card">
                    <img src={menu.imageUrl} alt={menu.name} className="menu-img" />
                    <div className="menu-content">
                      <h4 className="menu-title">{menu.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, height: '40px', overflow: 'hidden' }}>
                        {menu.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                        <span className="menu-price">
                          {menu.price.toLocaleString()}원
                        </span>
                        <button
                          onClick={() => {
                            const success = addToCart({
                              id: menu.id,
                              name: menu.name,
                              price: menu.price,
                              restaurantId: selectedRestaurant.id,
                              restaurantName: selectedRestaurant.name,
                            });
                            if (success) {
                              showToast(`${menu.name}이(가) 장바구니에 담겼습니다!`);
                            }
                          }}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                        >
                          + 담기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {/* 토스트 알림 컨테이너 */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="toast-icon">✨</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
