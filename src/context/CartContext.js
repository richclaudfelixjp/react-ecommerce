import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import UserContext from './UserContext';
import api from '../api/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { userInfo } = useContext(UserContext);

  const fetchCart = useCallback(async () => {
    if (userInfo && userInfo.token) {
      try {
        const { data } = await api.get('/user/cart');
        setCart(data);
      } catch (error) {
        console.error('Failed to fetch cart', error);
        setCart(null);
      }
    } else {
      setCart(null);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/user/cart/update/${itemId}?quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart item quantity', error);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await api.delete(`/user/cart/remove/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove cart item', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      await api.post(`/user/cart/add?productId=${productId}&quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to add item to cart', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        updateCartItemQuantity,
        removeCartItem,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;