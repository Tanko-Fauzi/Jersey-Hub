import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaTruck, FaBolt, FaMotorcycle, FaCreditCard } from 'react-icons/fa';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
    }
    fetchDeliveryOptions();
  }, []);

  const fetchDeliveryOptions = async () => {
    try {
      const { data } = await axios.get('/api/delivery/options');
      setDeliveryOptions(data);
    } catch (error) {
      console.error('Error fetching delivery options:', error);
      setDeliveryOptions([
        { id: 'standard', name: 'Standard Delivery', price: 30.00, estimatedTime: '3-5 days' },
        { id: 'express', name: 'Express Delivery', price: 50.00, estimatedTime: '1-2 days' },
        { id: 'rider', name: 'Personal Rider', price: 70.00, estimatedTime: 'Same day' }
      ]);
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setStep(2);
  };

  const handleCreateOrder = async () => {
    if (!selectedDelivery) {
      toast.error('Please select a delivery method');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cart.items,
        shippingAddress: shippingInfo,
        deliveryMethod: {
          type: selectedDelivery.id,
          name: selectedDelivery.name,
          price: selectedDelivery.price
        },
        paymentMethod: 'pending',
        subtotal: getCartTotal(),
        deliveryFee: selectedDelivery.price,
        total: getCartTotal() + selectedDelivery.price,
      };

      const { data } = await axios.post('/api/orders', orderPayload);
      
      setOrderData(data);
      toast.success('Order created! Proceed to payment.');
      setStep(3);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    // Simulate payment success
    toast.success('Payment successful!');
    clearCart();
    navigate(`/order-confirmation/${orderData.orderNumber}`);
  };

  const getDeliveryIcon = (type) => {
    switch(type) {
      case 'standard': return <FaTruck />;
      case 'express': return <FaBolt />;
      case 'rider': return <FaMotorcycle />;
      default: return <FaTruck />;
    }
  };

  // Step 1: Shipping Information
  if (step === 1) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        <button 
          onClick={() => navigate('/cart')}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          <FaArrowLeft /> Back to Cart
        </button>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #4CAF50', color: '#1a1e24', fontWeight: 700 }}>
              Shipping
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #ddd', color: '#999' }}>
              Delivery
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #ddd', color: '#999' }}>
              Payment
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Shipping Information</h2>
          
          <form onSubmit={handleShippingSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Name *</label>
              <input type="text" value={shippingInfo.fullName} onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})} required
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email *</label>
                <input type="email" value={shippingInfo.email} onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})} required
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Phone *</label>
                <input type="tel" value={shippingInfo.phone} onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} required
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Address *</label>
              <input type="text" value={shippingInfo.address} onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} required
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>City *</label>
                <input type="text" value={shippingInfo.city} onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} required
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Postal Code *</label>
                <input type="text" value={shippingInfo.postalCode} onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})} required
                  style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px' }} />
              </div>
            </div>

            <button type="submit"
              style={{ width: '100%', padding: '15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
              Continue to Delivery
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Step 2: Delivery Method
  if (step === 2) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
        <button onClick={() => setStep(1)}
          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', marginBottom: '20px' }}>
          <FaArrowLeft /> Back to Shipping
        </button>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #4CAF50', color: '#4CAF50', fontWeight: 700 }}>✓ Shipping</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #4CAF50', color: '#1a1e24', fontWeight: 700 }}>Delivery</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #ddd', color: '#999' }}>Payment</div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Select Delivery Method</h2>
          
          <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
            {deliveryOptions.map(option => (
              <div key={option.id} onClick={() => setSelectedDelivery(option)}
                style={{
                  border: selectedDelivery?.id === option.id ? '2px solid #4CAF50' : '1px solid #ddd',
                  borderRadius: '15px', padding: '20px', cursor: 'pointer',
                  background: selectedDelivery?.id === option.id ? '#f0fff4' : 'white',
                  transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '15px'
                }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: selectedDelivery?.id === option.id ? '#4CAF50' : '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selectedDelivery?.id === option.id ? 'white' : '#666', fontSize: '24px'
                }}>
                  {getDeliveryIcon(option.id)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '5px' }}>{option.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{option.estimatedTime}</p>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4CAF50' }}>
                  GHS {option.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8f9fc', borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span>GHS {getCartTotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Delivery</span>
              <span>GHS {selectedDelivery ? selectedDelivery.price.toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #ddd', fontSize: '1.2rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: '#4CAF50' }}>
                GHS {(getCartTotal() + (selectedDelivery?.price || 0)).toFixed(2)}
              </span>
            </div>
          </div>

          <button onClick={handleCreateOrder} disabled={!selectedDelivery || loading}
            style={{
              width: '100%', padding: '15px', background: selectedDelivery && !loading ? '#4CAF50' : '#ccc',
              color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 600,
              cursor: selectedDelivery && !loading ? 'pointer' : 'not-allowed'
            }}>
            {loading ? 'Creating Order...' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Payment
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => setStep(2)}
        style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', marginBottom: '20px' }}>
        <FaArrowLeft /> Back to Delivery
      </button>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #4CAF50', color: '#4CAF50', fontWeight: 700 }}>✓ Shipping</div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #4CAF50', color: '#4CAF50', fontWeight: 700 }}>✓ Delivery</div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px', borderBottom: '3px solid #4CAF50', color: '#1a1e24', fontWeight: 700 }}>Payment</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <FaCreditCard style={{ fontSize: '50px', color: '#4CAF50', marginBottom: '20px' }} />
        
        <h2 style={{ marginBottom: '15px' }}>Complete Your Payment</h2>
        
        <div style={{ background: '#f8f9fc', borderRadius: '15px', padding: '20px', marginBottom: '25px', textAlign: 'left' }}>
          <p style={{ marginBottom: '10px' }}><strong>Order Number:</strong> {orderData?.orderNumber}</p>
          <p style={{ marginBottom: '10px' }}><strong>Total Amount:</strong> GHS {orderData?.total.toFixed(2)}</p>
          <p><strong>Email:</strong> {shippingInfo.email}</p>
        </div>

        <button onClick={handlePayment}
          style={{
            width: '100%', padding: '15px', background: '#00c3a3', color: 'white', border: 'none',
            borderRadius: '10px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginBottom: '15px'
          }}>
          Pay GHS {orderData?.total.toFixed(2)}
        </button>

        <p style={{ fontSize: '12px', color: '#999' }}>
          This is a demo payment. Click to simulate successful payment.
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;