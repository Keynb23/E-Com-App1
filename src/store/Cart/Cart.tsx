import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  removeItemFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  type CartItem 
} from '../cartSlice';
import type { AppDispatch } from '../store';
import '../Cart/Cart.css';


const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems) as CartItem[];
  const totalItems = useSelector(selectTotalItems) as number;
  const totalPrice = useSelector(selectTotalPrice) as number;
  const [checkoutMessage, setCheckoutMessage] = useState<string>('');

  const handleRemoveItem = (productId: number) => {
    dispatch(removeItemFromCart(productId));
  };

  const handleIncrement = (productId: number) => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrement = (productId: number) => {
    dispatch(decrementQuantity(productId));
  };

  const handleCheckout = () => {
    dispatch(clearCart());
    setCheckoutMessage('Checkout successful! Your order has been placed and your cart has been cleared.');
    setTimeout(() => setCheckoutMessage(''), 5000);
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
        <p>Your cart is currently empty.</p>
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
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p>
        <button onClick={handleCheckout} className="checkout-button" disabled={cartItems.length === 0}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;