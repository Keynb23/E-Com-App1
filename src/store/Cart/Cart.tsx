import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectTotalItems, selectTotalPrice, removeItemFromCart, incrementQuantity, decrementQuantity, clearCart, type CartItem } from '../cartSlice';
import type { AppDispatch } from '../store';
import '../Cart/Cart.css';
import type { Product } from '../../types/types';
import { Rating } from '@smastrom/react-rating';
import Button from '../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 🛒 Select cart data from Redux store
  const cartItems = useSelector(selectCartItems) as CartItem[];
  const totalItems = useSelector(selectTotalItems) as number;
  const totalPrice = useSelector(selectTotalPrice) as number;

  // ✅ State to show checkout success message
  const [checkoutMessage, setCheckoutMessage] = useState<string>('');

  // ❌ Remove item from cart
  const handleRemoveItem = (productId: number) => {
    dispatch(removeItemFromCart(productId));
  };

  // ➕ Increment item quantity
  const handleIncrement = (productId: number) => {
    dispatch(incrementQuantity(productId));
  };

  // ➖ Decrement item quantity
  const handleDecrement = (productId: number) => {
    dispatch(decrementQuantity(productId));
  };

  // 💳 Checkout and clear the cart
  const handleCheckout = () => {
    dispatch(clearCart());
    setCheckoutMessage('Checkout successful! Your order has been placed and your cart has been cleared.');
    setTimeout(() => setCheckoutMessage(''), 5000);
  };

  // 📊 Find the most common category in the cart
  function getMostFrequentCategory(cartItems: Product[]): string | null {
    const counts: Record<string, number> = {};

    for (const item of cartItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  }

  // 🔍 Fetch recommended products based on category
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
      enabled: !!category, // Only fetch when category is not null
    });
  }

  // ✅ Show success message after checkout
  if (checkoutMessage) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p className="checkout-success-message">{checkoutMessage}</p>
      </div>
    );
  }

  // 📭 Show empty cart message
  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  const mostFrequentCategory = getMostFrequentCategory(cartItems);
  const { data: recommended, isLoading } = useRecommendedProducts(mostFrequentCategory);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {/* 🧾 Cart Items */}
      <div className="cart-items-list">
        {cartItems.map((item: CartItem) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.title}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>

              {/* ➕➖ Quantity Controls */}
              <div className="cart-item-quantity">
                <button onClick={() => handleDecrement(item.id)} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncrement(item.id)}>+</button>
              </div>

              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <button onClick={() => handleRemoveItem(item.id)} className="cart-item-remove-button">
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* 📦 Order Summary */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        <button onClick={handleCheckout} className="checkout-button" disabled={cartItems.length === 0}>
          Proceed to Checkout
        </button>

        {/* 🌟 Recommended Products */}
        <div className="below-checkout">
          <div className="mightlike">
          <p>You might also like:</p></div>
          <div className="recommended-products">
            {isLoading && <p>Loading recommendations...</p>}
            {!isLoading && recommended?.slice(0, 1).map(product => (
              <div key={product.id} className="cart-product-card">
                <h3>{product.brand}</h3>
                <h5>{product.category}</h5>
                <p>${product.price}</p>
                <Rating style={{ maxWidth: 150 }} value={product.rating.rate} readOnly />
                <img src={product.image} alt={product.brand} className="cart-product-image" />
                <Button product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
