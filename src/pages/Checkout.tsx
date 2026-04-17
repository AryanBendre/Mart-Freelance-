import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order in Razorpay
      const amount = totalPrice();
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();

      // Simulate Razorpay payment success (since we don't have the frontend SDK loaded)
      // In a real app, you would load Razorpay checkout script here
      
      // 2. Save order to our database
      const saveRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
          total_amount: amount,
          delivery_address: address,
          payment_id: orderData.id || 'mock_payment_id',
        }),
      });

      if (!saveRes.ok) throw new Error('Failed to save order');

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Delivery Address</h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your complete delivery address..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
        <div className="space-y-4 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
          <span>Total Amount</span>
          <span>₹{totalPrice()}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-70"
      >
        {loading ? 'Processing...' : `Pay ₹${totalPrice()}`}
      </button>
    </div>
  );
}
