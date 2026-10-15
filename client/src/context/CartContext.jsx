import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);           // [{product:{...}, quantity:N}]
  const [cartLoaded, setCartLoaded] = useState(false);

  // Derived: total item count and subtotal
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart || []);
      setCartLoaded(true);
    } catch {
      setCart([]);
      setCartLoaded(true);
    }
  }, []);

  const addToCart = useCallback(async (productId) => {
    const res = await api.post(`/cart/${productId}`);
    setCart(res.data.cart || []);
    return res.data;
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const res = await api.patch(`/cart/${productId}`, { quantity });
    setCart(res.data.cart || []);
    return res.data;
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    setCart(res.data.cart || []);
    return res.data;
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartLoaded(false);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartLoaded,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
