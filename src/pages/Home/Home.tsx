import { useEffect, useState, useMemo } from 'react';
import type { Product } from '../../types/types';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProductContext } from '../../context/ProductContext';
import { useQuery } from '@tanstack/react-query';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { fetchCategoriesFromFirestore, fetchBrandsFromFirestore, ProductFilters } from '../../components/filter/filters';
import React from 'react';

// fetchProductsFromFirestore
const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  const db = getFirestore();
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    rating: doc.data().rating || { rate: 0, count: 0 },
    price: parseFloat(doc.data().price) || 0,
  })) as unknown as Product[];
};

const Home: React.FC = () => {
  const { products, dispatch } = useProductContext();

  // Local filter state (remove date fields, only use what's needed for product filtering)
  const [filterState, setFilterState] = useState({
    brand: '',
    category: '',
    priceRange: [0, 10000] as [number, number],
  });

  // Use useQuery to fetch products from Firestore
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductsFromFirestore,
  });

  // Use useQuery to fetch categories from Firestore
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoriesFromFirestore,
  });

  // Use useQuery to fetch brands from Firestore
  const {
    data: brandsData,
    isLoading: brandsLoading,
    error: brandsError
  } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrandsFromFirestore,
  });

  // Effect to update the product context when productsData changes
  useEffect(() => {
    if (productsData) {
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
      // Set price range dynamically on load
      const prices = productsData.map((p: Product) => Number(p.price));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setFilterState(s => ({
        ...s,
        priceRange: [isFinite(min) ? min : 0, isFinite(max) ? max : 10000]
      }));
    }
  }, [productsData, dispatch]);

  // Derived filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filterState.brand) {
      filtered = filtered.filter((product: Product) => product.brand === filterState.brand);
    }
    if (filterState.category) {
      filtered = filtered.filter((product: Product) => product.category === filterState.category);
    }
    filtered = filtered.filter((product: Product) =>
      product.price >= filterState.priceRange[0] &&
      product.price <= filterState.priceRange[1]
    );
    return filtered;
  }, [products, filterState]);

  // Handle loading and error states for the UI
  if (productsLoading || categoriesLoading || brandsLoading) {
    return <div className="loading-message">Loading products, categories, and brands...</div>;
  }

  if (productsError) {
    return <div className="error-message">Error loading products: {productsError.message}</div>;
  }

  if (categoriesError) {
    return <div className="error-message">Error loading categories: {categoriesError.message}</div>;
  }

  if (brandsError) {
    return <div className="error-message">Error loading brands: {brandsError.message}</div>;
  }

  return (
    <div className='home-page-layout'>
    <div className='filter-sidebar'>
      <ProductFilters
        brand={filterState.brand}
        category={filterState.category}
        priceRange={filterState.priceRange}
        setBrand={brand => setFilterState(s => ({ ...s, brand }))}
        setCategory={category => setFilterState(s => ({ ...s, category }))}
        setPriceRange={priceRange => setFilterState(s => ({ ...s, priceRange }))}
        brands={brandsData ?? []}
        categories={categoriesData ?? []}
        minPrice={filterState.priceRange[0]}
        maxPrice={filterState.priceRange[1]}
      />
      <button
        onClick={() =>
          setFilterState({
            brand: '',
            category: '',
            priceRange: [
              products.length
                ? Math.min(...products.map((p: Product) => Number(p.price)))
                : 0,
              products.length
                ? Math.max(...products.map((p: Product) => Number(p.price)))
                : 10000
            ]
          })
        }
        className='button-29'
        style={{ marginTop: 12 }}
      >
        Clear Filter
      </button>
    </div>

      <div className='products-home-container'>
        <div className='container'>
          {filteredProducts.length === 0 ? (
            <p className="no-products-message">No products found for the selected criteria. Add some via the CRUD page!</p>
          ) : (
            filteredProducts.map((product: Product) => (
              <ProductCard product={product} key={product.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;