import React, { useState } from 'react';
import { usePaystack } from '@makozi/paystack-react-pay';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaystackPayment = ({ 
  email, 
  amount, 
  orderId, 
  onSuccess, 
  onClose,
  buttonText = 'Pay Now',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  
  const config = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_yourkey',
    email: email,
    amount: Math.round(amount * 100), // Convert GHS to pesewas
    currency: 'GHS',
    metadata: {
      orderId: orderId,
      custom_fields: [
        {
          display_name: 'Product Type',
          variable_name: 'product_type',
          value: 'Football Jersey'
        }
      ]
    },
    onSuccess: async (response) => {
      setLoading(true);
      
      try {
        // Verify payment on backend
        const { data } = await axios.get(`/api/payments/verify/${response.reference}`);
        
        if (data.success) {
          toast.success('Payment successful!');
          onSuccess && onSuccess(response, data);
        } else {
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Payment verification failed');
      } finally {
        setLoading(false);
      }
    },
    onClose: () => {
      toast('Payment cancelled', { icon: '⚠️' });
      onClose && onClose();
    }
  };
  
  const { initializePayment } = usePaystack(config);
  
  return (
    <button
      onClick={initializePayment}
      disabled={loading}
      className={className}
      style={{
        width: '100%',
        padding: '15px',
        background: loading ? '#ccc' : '#00c3a3', // Paystack green
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      {loading ? 'Processing...' : buttonText}
    </button>
  );
};

export default PaystackPayment;