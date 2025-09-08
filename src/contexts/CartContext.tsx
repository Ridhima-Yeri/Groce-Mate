import React, { createContext, useState, useContext, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Define Product interface for type safety
interface Product {
  _id: string;
  name: string;
  price: number | string;
  image?: string;
  category?: {
    name: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage if available
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setItems(currentItems => {
      // Check if product already exists in cart
      const existingItem = currentItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Increment quantity if product exists
        return currentItems.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...currentItems, { 
          _id: product._id, 
          name: product.name, 
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price, 
          quantity: 1,
          image: product.image
        }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item._id !== productId)
    );
  };

  // Update quantity of a product
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item._id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  // Get total price of all items in cart
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get total number of items
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
