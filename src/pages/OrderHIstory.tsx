import { useQuery } from '@tanstack/react-query';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; 
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react'; 
import './OrderHistory.css';

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
    staleTime: 5 * 60 * 1000, // refreshes every 5 minutes
  });

  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [currentUser, refetch]);


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
      <h2>Order History</h2>
      {orders && orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders?.map((order: any) => (
            <li key={order.id}>
              <strong>Order ID:</strong> {order.id}<br />
              <strong>Date:</strong> {order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}<br />
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
              <ul>
                {order.products.map((product: any, index: number) => ( 
                  <li key={product.id || index}>{product.title} - ${product.price.toFixed(2)} x {product.quantity || 1}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;