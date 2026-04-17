import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import PaystackPayment from '../components/PaystackPayment';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // ... existing useEffect and fetch functions ...

  const handlePlaceOrder = async () => {
    if (!selectedDelivery) {
      toast.error('Please select a delivery method');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.items,
        shippingAddress: shippingInfo,
        deliveryMethod: {
          type: selectedDelivery.id,
          name: selectedDelivery.name,
          price: selectedDelivery.price
        },
        paymentMethod: 'paystack',
        subtotal: getCartTotal(),
        deliveryFee: selectedDelivery.price,
        total: getCartTotal() + selectedDelivery.price,
        status: 'pending'
      };

      const { data } = await axios.post('/api/orders', orderData);
      setOrderId(data._id);
      setStep(3); // Move to payment step
      
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (response, verificationData) => {
    clearCart();
    navigate(`/order-confirmation/${orderId}`, {
      state: { paymentSuccess: true, reference: response.reference }
    });
  };

  const handlePaymentClose = () => {
    setStep(2); // Go back to delivery selection
  };

  // ... rest of your existing code ...

  // Step 3: Payment
  if (step === 3) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <div className="checkout-steps">
          <div className="step completed">Shipping</div>
          <div className="step completed">Delivery</div>
          <div className="step active">Payment</div>
        </div>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Complete Your Payment</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Order Total:</strong> GHS {(getCartTotal() + (selectedDelivery?.price || 0)).toFixed(2)}</p>
            <p><strong>Email:</strong> {shippingInfo.email}</p>
          </div>
          
          <PaystackPayment
            email={shippingInfo.email}
            amount={getCartTotal() + (selectedDelivery?.price || 0)}
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
            onClose={handlePaymentClose}
            buttonText={`Pay GHS ${(getCartTotal() + (selectedDelivery?.price || 0)).toFixed(2)}`}
          />
          
          <button
            onClick={() => setStep(2)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '15px',
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Back to Delivery
          </button>
          
          <p style={{ 
            marginTop: '20px', 
            fontSize: '12px', 
            color: '#666', 
            textAlign: 'center' 
          }}>
            Secure payment powered by Paystack. We accept Visa, Mastercard, and Mobile Money.
          </p>
        </div>
      </div>
    );
  }

  // ... rest of your existing step 1 and step 2 code ...
};

export default CheckoutPage;