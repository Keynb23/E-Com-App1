import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './filter.css';

// --- Types for filter state ---
export interface OrderHistoryFilterState {
  brand: string;
  category: string;
  priceRange: [number, number];
  dateRange: string; // "all", "yesterday", "last_week", "last_month", "last_quarter", "last_year", "custom"
  customDate: { start: string | null; end: string | null };
}

export interface ProductFilterState {
  brand: string;
  category: string;
  priceRange: [number, number];
}

interface OrderHistoryFiltersProps {
  brand: string;
  category: string;
  priceRange: [number, number];
  dateRange: string;
  customDate: { start: string | null; end: string | null };
  setBrand: (brand: string) => void;
  setCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setDateRange: (dateRange: string) => void;
  setCustomDate: (date: { start: string | null; end: string | null }) => void;
  brands: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
}

interface ProductFiltersProps {
  brand: string;
  category: string;
  priceRange: [number, number];
  setBrand: (brand: string) => void;
  setCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  brands: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
}

// --- Fetch unique brands from Firestore ---
export const fetchBrandsFromFirestore = async (): Promise<string[]> => {
  const db = getFirestore();
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  const allBrands = new Set<string>();

  querySnapshot.docs.forEach(doc => {
    const brand = doc.data().brand;
    if (typeof brand === 'string' && brand) {
      allBrands.add(brand);
    }
  });
  return Array.from(allBrands);
};

// --- Fetch unique categories from Firestore ---
export const fetchCategoriesFromFirestore = async (): Promise<string[]> => {
  const db = getFirestore();
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  const allCategories = new Set<string>();

  querySnapshot.docs.forEach(doc => {
    const category = doc.data().category;
    if (typeof category === 'string' && category) {
      allCategories.add(category);
    }
  });
  return Array.from(allCategories);
};

// --- OrderHistoryFilters (for order history page) ---
export const OrderHistoryFilters: React.FC<OrderHistoryFiltersProps> = ({
  brand,
  category,
  priceRange,
  dateRange,
  customDate,
  setBrand,
  setCategory,
  setPriceRange,
  setDateRange,
  setCustomDate,
  brands,
  categories,
  minPrice,
  maxPrice,
}) => {
  const [localMin, setLocalMin] = useState<number>(priceRange[0]);
  const [localMax, setLocalMax] = useState<number>(priceRange[1]);

  useEffect(() => {
    setLocalMin(priceRange[0]);
    setLocalMax(priceRange[1]);
  }, [priceRange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMin(value);
    setPriceRange([value, localMax]);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMax(value);
    setPriceRange([localMin, value]);
  };

  return (
    <div className="order-history-filters">
      {/* Brand Filter */}
      <div className="order-history-filters__section">
        <label className="order-history-filters__label">Brand</label>
        <select
          className="order-history-filters__select"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        >
          <option value="">All</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="order-history-filters__section">
        <label className="order-history-filters__label">Category</label>
        <select
          className="order-history-filters__select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="order-history-filters__section">
        <label className="order-history-filters__label">Price Range</label>
        <div className="order-history-filters__price-range-slider">
          <input
            className="order-history-filters__input"
            type="number"
            min={minPrice}
            max={localMax}
            value={localMin}
            onChange={handleMinChange}
          />
          <span className="order-history-filters__span">to</span>
          <input
            className="order-history-filters__input"
            type="number"
            min={localMin}
            max={maxPrice}
            value={localMax}
            onChange={handleMaxChange}
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="order-history-filters__section">
        <label className="order-history-filters__label">Date Bought</label>
        <select
          className="order-history-filters__select"
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="yesterday">Yesterday</option>
          <option value="last_week">Last Week</option>
          <option value="last_month">Last Month</option>
          <option value="last_quarter">Last Quarter</option>
          <option value="last_year">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
        {dateRange === 'custom' && (
          <div className="order-history-filters__custom-date-range">
            <label>
              Start:
              <input
                className="order-history-filters__input"
                type="date"
                value={customDate.start ?? ''}
                onChange={e => setCustomDate({ ...customDate, start: e.target.value })}
              />
            </label>
            <label>
              End:
              <input
                className="order-history-filters__input"
                type="date"
                value={customDate.end ?? ''}
                onChange={e => setCustomDate({ ...customDate, end: e.target.value })}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ProductFilters (for home page shopping filter, no date filter!) ---
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  brand,
  category,
  priceRange,
  setBrand,
  setCategory,
  setPriceRange,
  brands,
  categories,
  minPrice,
  maxPrice,
}) => {
  const [localMin, setLocalMin] = useState<number>(priceRange[0]);
  const [localMax, setLocalMax] = useState<number>(priceRange[1]);

  useEffect(() => {
    setLocalMin(priceRange[0]);
    setLocalMax(priceRange[1]);
  }, [priceRange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMin(value);
    setPriceRange([value, localMax]);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMax(value);
    setPriceRange([localMin, value]);
  };

  return (
    <div className="product-filters">
      {/* Brand Filter */}
      <div className="product-filters__section">
        <label className="product-filters__label">Brand</label>
        <select
          className="product-filters__select"
          value={brand}
          onChange={e => setBrand(e.target.value)}
        >
          <option value="">All</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="product-filters__section">
        <label className="product-filters__label">Category</label>
        <select
          className="product-filters__select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="product-filters__section">
        <label className="product-filters__label">Price Range</label>
        <div className="product-filters__price-range-slider">
          <input
            className="product-filters__input"
            type="number"
            min={minPrice}
            max={localMax}
            value={localMin}
            onChange={handleMinChange}
          />
          <span className="product-filters__span">to</span>
          <input
            className="product-filters__input"
            type="number"
            min={localMin}
            max={maxPrice}
            value={localMax}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  );
};