import React, { useState } from 'react';
import axios from 'axios';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);

  const trackOrder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/orders/${orderNumber}`);
      setOrder(data);
    } catch (error) {
      alert('Order not found');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Track Your Order</h1>
      <form onSubmit={trackOrder}>
        <input
          type="text"
          placeholder="Enter Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Track Order
        </button>
      </form>
      
      {order && (
        <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
          <h3>Order Status: {order.status}</h3>
          <p>Order Number: {order.orderNumber}</p>
          <p>Total: ${order.total}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;