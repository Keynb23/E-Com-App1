import { useEffect } from 'react';
import type { Category, Product } from '../../types/types';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProductContext } from '../../context/ProductContext';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '../../api/api';



const Home: React.FC = () => {
  const { products, dispatch, selectedCategory } = useProductContext();

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (productsData) {
      dispatch({ type: 'SET_PRODUCTS', payload: productsData.data });
    }
  }, [productsData, dispatch]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const getFilteredProducts = () => {
    if (selectedCategory) {
      const filteredByCategory = products.filter(
        (product: Product) => product.category === selectedCategory
      );
      return filteredByCategory;
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();
  return (
    <div>
      <div className="hero-overlay">
          FAKE STORE
        </div>
      <div className="hero-video-container">
        <video autoPlay loop muted id="heroVideo">
          <source src="https://www.shutterstock.com/shutterstock/videos/1038264401/preview/stock-footage-old-colorful-posters-ripped-torn-crumpled-paper-abstract-grunge-texture-wall-backdrop-placard.webm" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className='cat-controls'>
        <select
          onChange={(e) =>
            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })
          }
          value={selectedCategory}
          className='button-29'
        >
          <option value=''>All Categories</option>
          {categories?.data.map((category: Category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' })
          }
          className='button-29'
        >
          Clear Filter
        </button>
      </div>
      <div className='home-container'>
        <div className='container'>
          {filteredProducts.map((product: Product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
