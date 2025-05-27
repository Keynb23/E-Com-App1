import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart, incrementQuantity, decrementQuantity, clearCart } from '../../../store/cartSlice';
import type { Product } from '../../../types/types';
import './button.css';

type Props = {
  product: Product;
};

const AddToCart: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemToCart(product));
  };

  return (
    <div className="Add-to">
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

const IncrementButton: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(incrementQuantity(product.id));
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity(product.id));
  };

  return (
    <div className="quantity">
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  );
};

const ClearCart: React.FC = () => { 
  const dispatch = useDispatch();

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="clear">
      <button onClick={handleClearCart}>Clear</button>
    </div>
  );
};

const CartButtons: React.FC<Props> = ({ product }) => {
  return (
    <>
      <AddToCart product={product} />
      <IncrementButton product={product} />
      <ClearCart />
    </>
  );
};

export default CartButtons;
export { AddToCart, ClearCart, IncrementButton };