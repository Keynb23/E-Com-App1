import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  removeItemFromCart,
  clearCart, 
} from '../../store/cartSlice';
import type { CartItem } from '../../types/types';
import type { AppDispatch } from '../../store/store';
import '../Cart/Cart.css';
import type { Product } from '../../types/types';
import { Rating } from '@smastrom/react-rating';
import { AddToCart, IncrementButton, ClearCart } from '../ui/button/CartButtons';
import { useQuery } from '@tanstack/react-query';

import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext'; 


const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems) as CartItem[];
  const totalItems = useSelector(selectTotalItems) as number;
  const totalPrice = useSelector(selectTotalPrice) as number;

  const [checkoutMessage, setCheckoutMessage] = useState<string>('');
  const [checkoutError, setCheckoutError] = useState<string>('');

  const { user } = useAuth(); 

  const handleRemoveItem = (productId: number) => {
    dispatch(removeItemFromCart(productId.toString()));
  };

  function getMostFrequentCategory(cartItems: CartItem[]): string | null {
    const counts: Record<string, number> = {};

    for (const item of cartItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  }

  function useRecommendedProducts(category: string | null) {
    return useQuery({
      queryKey: ['recommended', category],
      queryFn: async () => {
        if (!category) return [];

        const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        if (!res.ok) throw new Error('Failed to fetch recommended products');
        const data = await res.json();
        return data as Product[];
      },
      enabled: !!category,
    });
  }

  const mostFrequentCategory = getMostFrequentCategory(cartItems);
  const { data: recommended, isLoading } = useRecommendedProducts(mostFrequentCategory);

  const handleCheckout = async () => {
    if (!user) {
      setCheckoutError('You must be logged in to complete a purchase.');
      return;
    }

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setCheckoutError(''); 
    setCheckoutMessage('');

    try {
      const db = getFirestore();
      const ordersCollectionRef = collection(db, 'orders');


      const orderData = {
        userId: user.uid,
        products: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image, 
          category: item.category, 
        })),
        totalPrice: totalPrice,
        timestamp: Timestamp.now(),
      };

      await addDoc(ordersCollectionRef, orderData);

      dispatch(clearCart());
      setCheckoutMessage('Thank you for your purchase!');
    } catch (error: any) {
      console.error('Error during checkout:', error);
      setCheckoutError('Checkout failed. Please try again. ' + error.message);
    }
  };

  if (checkoutMessage) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p className="checkout-success-message">{checkoutMessage}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p className="cart-empty-message">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <div className="cart-items-list">
        {cartItems.map((item: CartItem) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>

              <IncrementButton
                product={{
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.image,
                  brand: (item as any).brand ?? '',
                  description: (item as any).description ?? '',
                  category: item.category,
                  rating: (item as any).rating ?? { rate: 0, count: 0 },
                }}
              />
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button onClick={() => handleRemoveItem(Number(item.id))} className="cart-item-remove-button">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        <ClearCart />
        {checkoutError && <p className="error-message">{checkoutError}</p>} 
        <button onClick={handleCheckout} className="checkout-button" disabled={cartItems.length === 0 || !user}>
          Checkout
        </button>

        <div className="below-checkout">
          <div className="mightlike">
            <p>You might also like:</p>
          </div>
          <div className="recommended-products">
            {isLoading && <p>Loading recommendations...</p>}
            {!isLoading && recommended?.slice(0, 1).map(product => (
              <div key={product.id} className="cart-product-card">
                <h3>{product.title}</h3>
                <h5>{product.category}</h5>
                <p>${product.price.toFixed(2)}</p>
                <Rating style={{ maxWidth: 150 }} value={product.rating.rate} readOnly />
                <img src={product.image} alt={product.title} className="cart-product-image" /> 
                <AddToCart product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;