import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const paymentSuccess = location.state?.paymentSuccess;
  const reference = location.state?.reference;

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '60px', marginBottom: '20px' }}>
        {paymentSuccess ? '✅' : '📦'}
      </div>
      
      <h1>
        {paymentSuccess ? 'Payment Successful!' : 'Order Confirmed!'}
      </h1>
      
      {reference && (
        <p style={{ color: '#666', marginBottom: '10px' }}>
          Payment Reference: <strong>{reference}</strong>
        </p>
      )}
      
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        Order Number: <strong>{id}</strong>
      </p>
      
      {order && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '10px',
          margin: '20px 0',
          textAlign: 'left'
        }}>
          <h3>Order Details</h3>
          <p><strong>Total:</strong> GHS {order.total?.toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Delivery Method:</strong> {order.deliveryMethod?.name}</p>
        </div>
      )}
      
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Thank you for your purchase! A confirmation email has been sent to your email address.
      </p>
      
      <Link 
        to="/"
        style={{
          display: 'inline-block',
          padding: '12px 30px',
          background: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          marginRight: '10px'
        }}
      >
        Continue Shopping
      </Link>
      
      <Link 
        to="/track-order"
        style={{
          display: 'inline-block',
          padding: '12px 30px',
          background: '#1a1e24',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Track Order
      </Link>
    </div>
  );
};

export default OrderConfirmationPage;