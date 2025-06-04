import { useQuery } from '@tanstack/react-query';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect, useMemo } from 'react';
import { OrderHistoryFilters, type OrderHistoryFilterState } from '../components/filter/filters';
import './OrderHistory.css';

// fetchOrders
const fetchOrders = async (userId: string) => {
  const db = getFirestore();
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
  }));
};

const OrderHistory = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterState, setFilterState] = useState<OrderHistoryFilterState>({
    brand: '',
    category: '',
    priceRange: [0, 10000], // Default range, can be set dynamically
    dateRange: 'all',
    customDate: { start: null, end: null },
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', currentUser?.uid],
    queryFn: () => fetchOrders(currentUser!.uid),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [currentUser, refetch]);

  // Flatten all products in all orders into one array, keeping order and product reference
  const flatProducts = useMemo(() => {
    if (!orders) return [];
    return orders.flatMap((order: any) =>
      order.products.map((product: any) => ({
        ...product,
        orderId: order.id,
        orderDate: order.timestamp,
      }))
    );
  }, [orders]);

  // Get min and max prices for dynamic price range
  const [minPrice, maxPrice] = useMemo(() => {
    if (!flatProducts.length) return [0, 1000];
    const prices = flatProducts.map((p: any) => Number(p.price));
    return [Math.min(...prices), Math.max(...prices)];
  }, [flatProducts]);

  // Filtering logic for brand, category, price, date
  const filteredProducts = useMemo(() => {
    let products = flatProducts;

    // Brand
    if (filterState.brand)
      products = products.filter((p: any) => p.brand === filterState.brand);

    // Category
    if (filterState.category)
      products = products.filter((p: any) => p.category === filterState.category);

    // Price Range
    products = products.filter(
      (p: any) =>
        Number(p.price) >= filterState.priceRange[0] &&
        Number(p.price) <= filterState.priceRange[1]
    );

    // Date Range
    if (filterState.dateRange !== 'all') {
      const now = new Date();
      let fromDate: Date | null = null;
      let toDate: Date | null = null;
      switch (filterState.dateRange) {
        case 'yesterday': {
          fromDate = new Date(now);
          fromDate.setDate(now.getDate() - 1);
          fromDate.setHours(0, 0, 0, 0);
          toDate = new Date(fromDate);
          toDate.setHours(23, 59, 59, 999);
          break;
        }
        case 'last_week': {
          fromDate = new Date(now);
          fromDate.setDate(now.getDate() - 7);
          break;
        }
        case 'last_month': {
          fromDate = new Date(now);
          fromDate.setMonth(now.getMonth() - 1);
          break;
        }
        case 'last_quarter': {
          fromDate = new Date(now);
          fromDate.setMonth(now.getMonth() - 3);
          break;
        }
        case 'last_year': {
          fromDate = new Date(now);
          fromDate.setFullYear(now.getFullYear() - 1);
          break;
        }
        case 'custom': {
          fromDate = filterState.customDate.start
            ? new Date(filterState.customDate.start)
            : null;
          toDate = filterState.customDate.end
            ? new Date(filterState.customDate.end)
            : null;
          break;
        }
        default:
          break;
      }
      products = products.filter((p: any) => {
        const date = new Date(p.orderDate || p.timestamp);
        if (fromDate && toDate) return date >= fromDate && date <= toDate;
        if (fromDate) return date >= fromDate;
        return true;
      });
    }

    // Search filter (id, title, brand, price)
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      products = products.filter(
        (product: any) =>
          (product.id && product.id.toLowerCase().includes(s)) ||
          (product.title && product.title.toLowerCase().includes(s)) ||
          (product.brand && product.brand.toLowerCase().includes(s)) ||
          (String(product.price).includes(s))
      );
    }

    return products;
  }, [flatProducts, filterState, search]);

  // For filter dropdowns
  const uniqueBrands = useMemo(() => {
    const set = new Set(flatProducts.map((p: any) => p.brand).filter(Boolean));
    return Array.from(set);
  }, [flatProducts]);
  const uniqueCategories = useMemo(() => {
    const set = new Set(flatProducts.map((p: any) => p.category).filter(Boolean));
    return Array.from(set);
  }, [flatProducts]);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) {
    console.error("Error fetching orders:", error);
    return <p>Error loading orders. Please try again.</p>;
  }
  if (!currentUser) {
    return <p>Please log in to view your order history.</p>;
  }

  return (
    <div className="order-history">
      <div className="order-history-controls">
        <div className="order-history-search-filter">
          <input
            type="text"
            placeholder="Search by product id, name, brand, or price"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 300,
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 14,
            }}
          />
          <OrderHistoryFilters
            brand={filterState.brand}
            category={filterState.category}
            priceRange={filterState.priceRange}
            dateRange={filterState.dateRange}
            customDate={filterState.customDate}
            setBrand={value => setFilterState(s => ({ ...s, brand: value }))}
            setCategory={value => setFilterState(s => ({ ...s, category: value }))}
            setPriceRange={value => setFilterState(s => ({ ...s, priceRange: value }))}
            setDateRange={value => setFilterState(s => ({ ...s, dateRange: value }))}
            setCustomDate={value => setFilterState(s => ({ ...s, customDate: value }))}
            brands={uniqueBrands}
            categories={uniqueCategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>
      </div>

      <h2>Past Orders</h2>

      {filteredProducts.length === 0 ? (
        <p>No products found for your search/filter.</p>
      ) : (
        <ul className="order-history-product-list">
          {filteredProducts.map((product: any, idx: number) => (
            <li
              key={product.id + product.orderId + idx}
              className="order-history-product-list-item"
              onClick={() => setSelectedProduct(product)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>{product.title}</strong> (Brand: {product.brand || '-'})
                <br />
                Price: ${product.price?.toFixed(2)}
                <br />
                Product ID: {product.id}
                <br />
                Order ID: {product.orderId}
                <br />
                Date: {product.orderDate ? new Date(product.orderDate).toLocaleDateString() : 'N/A'}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* PRODUCT DETAILS POPUP/SIDEBAR */}
      {selectedProduct && (
        <aside className="product-details-popup">
          <button
            className="product-details-close"
            onClick={() => setSelectedProduct(null)}
          >
            Close
          </button>
          <h3>{selectedProduct.title}</h3>
          {selectedProduct.image && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              style={{ width: '75%', margin: '0 auto', display: 'block', borderRadius: 10 }}
            />
          )}
          <p><strong>Product ID:</strong> {selectedProduct.id}</p>
          <p><strong>Brand:</strong> {selectedProduct.brand}</p>
          <p><strong>Category:</strong> {selectedProduct.category}</p>
          <p><strong>Price:</strong> ${selectedProduct.price?.toFixed(2)}</p>
          <p><strong>Description:</strong><br />{selectedProduct.description}</p>
          <p><strong>Order ID:</strong> {selectedProduct.orderId}</p>
          <p>
            <strong>Order Date:</strong>{' '}
            {selectedProduct.orderDate
              ? new Date(selectedProduct.orderDate).toLocaleString()
              : 'N/A'}
          </p>
          <p><strong>Quantity:</strong> {selectedProduct.quantity || 1}</p>
        </aside>
      )}
    </div>
  );
};

export default OrderHistory;