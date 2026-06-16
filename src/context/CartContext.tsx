'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;          // 메뉴 ID
  name: string;        // 메뉴 이름
  price: number;       // 메뉴 가격
  quantity: number;    // 수량
  restaurantId: number;// 식당 ID
  restaurantName: string; // 식당 이름
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => boolean;
  removeFromCart: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. 컴포넌트 로드시 로컬 스토리지에서 장바구니 로드
  useEffect(() => {
    const savedCart = localStorage.getItem('delivery_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('장바구니 파싱 에러:', e);
      }
    }
  }, []);

  // 2. 장바구니 상태 변경 시 로컬 스토리지에 자동 저장
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('delivery_cart', JSON.stringify(newCart));
  };

  // 3. 장바구니 추가 (다른 식당 메뉴 추가 차단 로직 포함)
  const addToCart = (newItem: Omit<CartItem, 'quantity'>): boolean => {
    if (cart.length > 0 && cart[0].restaurantId !== newItem.restaurantId) {
      const confirmClear = window.confirm(
        `장바구니에는 같은 식당의 메뉴만 담을 수 있습니다.\n기존 식당(${cart[0].restaurantName})의 장바구니를 비우고 '${newItem.restaurantName}'의 메뉴를 새로 담으시겠습니까?`
      );
      if (confirmClear) {
        saveCart([{ ...newItem, quantity: 1 }]);
        return true;
      }
      return false;
    }

    const existingIndex = cart.findIndex((item) => item.id === newItem.id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { ...newItem, quantity: 1 }]);
    }
    return true;
  };

  // 4. 장바구니 제거
  const removeFromCart = (menuId: number) => {
    const updatedCart = cart.filter((item) => item.id !== menuId);
    saveCart(updatedCart);
  };

  // 5. 수량 변경
  const updateQuantity = (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === menuId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  // 6. 장바구니 초기화
  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart는 CartProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
