import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../components/Store/authStore';
import { useLocation } from 'react-router-dom';

interface Order {
  id: number;
  boutique: string;
  montant: number;
  created_at: string;
  shipping_info?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
  };
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();
  const successMessage = location.state?.success;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cart/orders/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-gray-600">Store: {order.boutique}</p>
                  <p className="text-gray-600">
                    Date: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  {order.shipping_info && (
                    <div className="mt-2">
                      <p className="font-medium">Shipping to:</p>
                      <p>
                        {order.shipping_info.firstName} {order.shipping_info.lastName}
                      </p>
                      <p>{order.shipping_info.address}</p>
                      <p>{order.shipping_info.city}</p>
                    </div>
                  )}
                </div>
                <p className="text-lg font-semibold">${order.montant.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;