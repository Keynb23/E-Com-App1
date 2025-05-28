import { useEffect } from 'react';
import type { Product } from '../../types/types';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProductContext } from '../../context/ProductContext';
import { useQuery } from '@tanstack/react-query';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
// This asynchronous function fetches all product documents from the 'products' collection in Firestore. It maps each document to a `Product` type, ensuring that `id`, `rating`, and `price` fields are correctly formatted.

// fetchCategoriesFromFirestore
const fetchCategoriesFromFirestore = async (): Promise<string[]> => {
  const db = getFirestore();
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  const allCategories = new Set<string>();

  querySnapshot.docs.forEach(doc => {
    const category = doc.data().category;
    if (typeof category === 'string' && category) { // Ensure category exists and is a string
      allCategories.add(category);
    }
  });
  return Array.from(allCategories);
};
// This asynchronous function retrieves all unique product categories from the 'products' collection in Firestore. It iterates through each product document, extracts the category, and adds it to a Set to ensure uniqueness, then returns an array of these unique categories.

// Home Component
const Home: React.FC = () => {
  const { products, dispatch, selectedCategory } = useProductContext();

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

  // Effect to update the product context when productsData changes
  useEffect(() => {
    if (productsData) {
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
    }
  }, [productsData, dispatch]);
  // This effect hook updates the product context with fetched product data whenever `productsData` changes, ensuring the global state is synchronized with the Firestore data.

  // getFilteredProducts
  const getFilteredProducts = () => {
    if (selectedCategory) {
      const filteredByCategory = products.filter(
        (product: Product) => product.category === selectedCategory
      );
      return filteredByCategory;
    }
    return products;
  };
  // This function filters the list of products based on the `selectedCategory` from the product context. If a category is selected, it returns only products belonging to that category; otherwise, it returns all products.

  const filteredProducts = getFilteredProducts();

  // Handle loading and error states for the UI
  if (productsLoading || categoriesLoading) {
    return <div className="loading-message">Loading products and categories...</div>;
  }

  if (productsError) {
    return <div className="error-message">Error loading products: {productsError.message}</div>;
  }

  if (categoriesError) {
    return <div className="error-message">Error loading categories: {categoriesError.message}</div>;
  }

  return (
    <div className='home-page-layout'>
      <div className='filter-sidebar'>
        <h3>Filter by Category</h3>
        <select
          onChange={(e) =>
            dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })
          }
          value={selectedCategory}
          className='button-29'
        >
          <option value=''>All Categories</option>
          {categoriesData?.map((category: string) => (
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

      <div className='products-grid-container'>
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