import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Load cart on boot or user change
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Local storage guest cart
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        setCartItems(JSON.parse(guestCart));
      } else {
        setCartItems([]);
      }
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const response = await API.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await API.post('/cart/add', { productId: product.id, quantity });
        await fetchCart();
        return { success: true };
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        return { success: false, error: error.response?.data?.message || "Could not add to cart." };
      }
    } else {
      // Guest cart logic
      try {
        let updatedItems = [];
        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
          updatedItems = [...prevItems];
          
          if (existingItemIndex > -1) {
            const newQty = updatedItems[existingItemIndex].quantity + quantity;
            if (product.stockQuantity < newQty) {
              throw new Error(`Insufficient stock. Only ${product.stockQuantity} items available.`);
            }
            updatedItems[existingItemIndex].quantity = newQty;
          } else {
            if (product.stockQuantity < quantity) {
              throw new Error(`Insufficient stock. Only ${product.stockQuantity} items available.`);
            }
            updatedItems.push({ id: Date.now(), product, quantity });
          }
          
          localStorage.setItem('guest_cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        await API.put(`/cart/update/${itemId}?quantity=${quantity}`);
        await fetchCart();
        return { success: true };
      } catch (error) {
        console.error("Failed to update cart quantity:", error);
        return { success: false, error: error.response?.data?.message || "Could not update quantity." };
      }
    } else {
      // Guest cart update
      try {
        let success = true;
        let errorMsg = "";
        setCartItems((prevItems) => {
          const item = prevItems.find(item => item.id === itemId);
          if (item && item.product.stockQuantity < quantity) {
            success = false;
            errorMsg = `Insufficient stock. Only ${item.product.stockQuantity} items available.`;
            return prevItems;
          }
          const updatedItems = prevItems.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          );
          localStorage.setItem('guest_cart', JSON.stringify(updatedItems));
          return updatedItems;
        });
        return success ? { success: true } : { success: false, error: errorMsg };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        await API.delete(`/cart/remove/${itemId}`);
        await fetchCart();
      } catch (error) {
        console.error("Failed to remove item from cart:", error);
      }
    } else {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter(item => item.id !== itemId);
        localStorage.setItem('guest_cart', JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await API.delete('/cart/clear');
        setCartItems([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('guest_cart');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartLoading, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      getCartCount, 
      getCartTotal,
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
