import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingBag, CreditCard, Truck } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total } = useCart();

  if (!cart.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Order Summary
            </h2>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-800 font-medium">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Information
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border rounded-lg p-2"
              />
              <input
                type="email"
                placeholder="Email"
                className="border rounded-lg p-2"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Address"
                className="border rounded-lg p-2 md:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="border rounded-lg p-2"
              />
            </form>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 font-semibold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
              <button 
                className="w-full bg-black text-white py-3 rounded-lg mt-4 hover:bg-gray-800 transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;