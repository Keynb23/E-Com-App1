import React from 'react';
import './button/button.css';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  showQuantityControls?: boolean;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  showQuantityControls = false,
  quantity = 1,
  onIncrease,
  onDecrease
}) => {
  if (showQuantityControls) {
    return (
      <div className="parent-container">
        <button onClick={onDecrease} className="increments">-</button>
        <span className="cart-quantity">{quantity}</span>
        <button onClick={onIncrease} className="increments">+</button>
      </div>
    );
  }

  return (
    <button onClick={onClick} className={`cart-button ${className}`}>
      {children}
    </button>
  );
};

export default Button;
