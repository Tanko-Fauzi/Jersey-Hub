import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderNumber) {
      toast.error('Please enter an order number');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data } = await axios.get(`/api/orders/${orderNumber}`);
      setOrder(data);
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Order not found. Please check your order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FF9800';
      case 'processing': return '#2196F3';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
        Track Your Order
      </h1>
      
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={trackOrder}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>
              Order Number
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., JER-123456"
                style={{
                  flex: 1,
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  fontSize: '16px'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '15px 30px',
                  background: loading ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaSearch /> {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </div>
        </form>

        {order && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Order Details</h3>
            
            <div style={{
              background: '#f8f9fc',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '10px' }}><strong>Status:</strong></p>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: getStatusColor(order.status),
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '14px'
                }}>
                  {order.status}
                </div>
              </div>
              
              <div style={{
                borderTop: '1px solid #ddd',
                paddingTop: '15px',
                marginTop: '15px'
              }}>
                <p><strong>Delivery Address:</strong></p>
                <p style={{ color: '#666' }}>
                  {order.shippingAddress?.fullName}<br />
                  {order.shippingAddress?.address}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;