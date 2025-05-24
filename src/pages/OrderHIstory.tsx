import { useQuery } from "@tanstack/react-query";
import { getFirestore, collection, query, where, getDocs,} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const fetchOrders = async () => {
  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser) return [];

  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const OrderHistory = () => {
  const { data: orders, isLoading, error } = useQuery(["orders"], fetchOrders);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders</p>;

  return (
    <div className="OH.parent">
      <div className="order-history">
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <strong>Order ID:</strong> {order.id} <br />
                <strong>Date:</strong>{" "}
                {new Date(order.timestamp).toLocaleDateString()} <br />
                <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                <ul>
                  {order.products.map((product) => (
                    <li key={product.id}>
                      {product.name} - ${product.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
