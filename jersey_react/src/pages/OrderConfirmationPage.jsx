import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
      
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Order Confirmed!</h1>
      
      <div style={{
        background: '#f8f9fc',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          Order Number: <strong>{id}</strong>
        </p>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Thank you for your purchase! A confirmation email has been sent to your email address.
        </p>
        <p style={{ color: '#666' }}>
          Your order will be processed and shipped within 24 hours.
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link 
          to="/"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 600
          }}
        >
          Continue Shopping
        </Link>
        
        <Link 
          to="/track-order"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            background: '#1a1e24',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 600
          }}
        >
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;