import { useQuery } from '@tanstack/react-query';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './OrderHistory.css';

/**
 * Fetches the user's orders from Firestore
 */
const fetchOrders = async () => {
  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser) return [];

  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};


const OrderHistory = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders.</p>;

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
              <strong>Date:</strong> {new Date(order.timestamp?.seconds * 1000).toLocaleDateString()}<br />
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
              <ul>
                {order.products.map((product: any) => (
                  <li key={product.id}>{product.title} - ${product.price}</li>
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
