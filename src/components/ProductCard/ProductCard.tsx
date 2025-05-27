// ProductCard.tsx
import { useState } from 'react';
import type { Product } from '../../types/types';
import { Rating } from '@smastrom/react-rating';
import { AddToCart } from '../ui/button/CartButtons'; 
import './ProductCard.css';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="product-card" onClick={() => setShowDescription(prev => !prev)}>
      <h3>{product.title.length > 15 ? product.title.slice(0, 15) + '...' : product.title}</h3>
      <h2>{product.category}</h2>
      <p>${product.price}</p>
      <Rating style={{ maxWidth: 150 }} value={product.rating.rate} readOnly />
      <img src={product.image} alt={product.title} className="product-image" />

      <div className="add-to-cart">
        <AddToCart product={product} />
      </div>

      {showDescription && (
        <p className="product-description">{product.description.length > 150 ? product.description.slice(0, 150) + '...' : product.description}</p>
      )}

    </div>
  );
};

export default ProductCard;