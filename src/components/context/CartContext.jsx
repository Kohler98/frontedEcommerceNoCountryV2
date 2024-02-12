import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cartItems');
        return localData ? JSON.parse(localData) : [];
      });
    
      useEffect(() => {
        // Update local storage when cartItems changes
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }, [cartItems]);
    

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prevItems => prevItems.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId) => {
    // Find the item in the cart
    const itemIndex = cartItems.findIndex((item) => item.id === itemId);
  
    if (itemIndex !== -1) {
      // If the item exists in the cart
      if (cartItems[itemIndex].quantity === 1) {
        // If the item quantity is 1, remove it from the cart
        const updatedCart = [...cartItems];
        updatedCart.splice(itemIndex, 1);
        setCartItems(updatedCart);
      } else {
        // If the item quantity is more than 1, decrease the quantity by 1
        const updatedCart = [...cartItems];
        updatedCart[itemIndex].quantity -= 1;
        setCartItems(updatedCart);
      }
    }
  };

  const clearCart = () => {
    console.log('Clearing cart...');
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
    console.log('Cart cleared. Current cartItems:', cartItems);
    console.log('LocalStorage after clear:', localStorage.getItem('cartItems'));
  };
  

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
