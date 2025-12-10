// src/hooks/useCart.js
import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedItems);
  }, []);

  const saveCartToLocalStorage = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const removeFromCart = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
    saveCartToLocalStorage(updatedCartItems);
  };

  const updateQuantity = (index, delta) => {
    const updatedCartItems = cartItems.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    saveCartToLocalStorage(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const addToCart = (item) => {
    // Ensure item has all necessary fields
    if (!item.id || !item.size_id || !item.product_color_id) {
      console.error('Invalid item data', item);
      return;
    }
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
    saveCartToLocalStorage(updatedCartItems);
  };

  return {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart
  };
};