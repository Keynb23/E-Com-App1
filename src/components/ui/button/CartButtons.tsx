import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart, incrementQuantity, decrementQuantity, clearCart } from '../../../store/cartSlice';
import type { Product } from '../../../types/types';
import './button.css';

type Props = {
  product: Product;
};

// AddToCart
const AddToCart: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();

  // handleAddToCart
  const handleAddToCart = () => {
    dispatch(addItemToCart(product));
  };
  // This function dispatches the `addItemToCart` action to add the given product to the Redux cart state.

  return (
    <div className="Add-to">
      <button
        onClick={handleAddToCart}
        data-testid={`add-to-cart-btn-${product.id}`} // ✅ test ID for reliable test targeting
      >
        Add to Cart
      </button>
    </div>
  );
};

// IncrementButton
const IncrementButton: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();

  // handleIncrement
  const handleIncrement = () => {
    dispatch(incrementQuantity(product.id));
  };
  // This function dispatches the `incrementQuantity` action to increase the quantity of the specified product in the Redux cart state.

  // handleDecrement
  const handleDecrement = () => {
    dispatch(decrementQuantity(product.id));
  };
  // This function dispatches the `decrementQuantity` action to decrease the quantity of the specified product in the Redux cart state.
  // If the quantity drops to zero or below, the item is removed.

  return (
    <div className="quantity">
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  );
};

// ClearCart
const ClearCart: React.FC = () => {
  const dispatch = useDispatch();

  // handleClearCart
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  // This function dispatches the `clearCart` action to remove all items from the Redux cart state.

  return (
    <div className="clear">
      <button onClick={handleClearCart}>Clear</button>
    </div>
  );
};

// CartButtons
const CartButtons: React.FC<Props> = ({ product }) => {
  return (
    <>
      <AddToCart product={product} />
      <IncrementButton product={product} />
      <ClearCart />
    </>
  );
};
// This component is a composite that renders all three individual cart action buttons: AddToCart, IncrementButton, and ClearCart.
// It's designed to provide a complete set of cart interaction controls in one place.

export default CartButtons;
export { AddToCart, ClearCart, IncrementButton };