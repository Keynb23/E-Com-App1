import { useState } from 'react';
import type { Product } from '../../types/types';
import { Rating } from '@smastrom/react-rating';
import Button from '../ui/Button';
import './ProductCard.css';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="product-card" onClick={() => setShowDescription(prev => !prev)}>
      <h3>{product.brand}</h3>
      <p>${product.price}</p>
      <Rating style={{ maxWidth: 150 }} value={product.rating.rate} readOnly />
      <img src={product.image} alt={product.title} className="product-image" />
      
      {showDescription && (
        <p className="product-description">{product.description}</p>
      )}
      
      <div className="add-to-cart">
        <Button product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
