import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  // If cart is empty
  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '50px auto', 
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <FaShoppingCart style={{ fontSize: '5rem', opacity: 0.3, marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '10px' }}>Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Add some jerseys to get started!</p>
        <Link 
          to="/"
          style={{
            display: 'inline-block',
            padding: '15px 30px',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '16px'
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/')}
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
          <FaArrowLeft /> Continue Shopping
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
          Shopping Cart ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {/* Cart Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Cart Items */}
        <div>
          {cart.items.map((item) => (
            <div 
              key={item.product}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                gap: '20px',
                position: 'relative'
              }}
            >
              {/* Product Image */}
              <div style={{
                width: '120px',
                height: '120px',
                background: item.type === 'club' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '40px',
                flexShrink: 0
              }}>
                {item.type === 'club' ? '⚽' : '🏆'}
              </div>

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: item.type === 'club' ? '#1a1e24' : '#e74c3c',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {item.badge || (item.type === 'club' ? 'CLUB' : 'NATION')}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '5px' }}>
                    {item.team}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>
                    {item.name}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Size: <strong>{item.size}</strong>
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginTop: '15px'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4CAF50' }}>
                    GHS {item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          background: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px'
                        }}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          background: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px'
                        }}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '5px'
                      }}
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>
            Order Summary
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Subtotal ({getCartCount()} items)</span>
              <span style={{ fontWeight: 600 }}>GHS {getCartTotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Shipping</span>
              <span style={{ color: '#666' }}>Calculated at checkout</span>
            </div>
          </div>

          <div style={{
            borderTop: '2px solid #eee',
            paddingTop: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4CAF50' }}>
                GHS {getCartTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#45a049'}
            onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
          >
            Proceed to Checkout
          </button>

          <p style={{ 
            fontSize: '12px', 
            color: '#999', 
            textAlign: 'center', 
            marginTop: '15px' 
          }}>
            Secure checkout powered by Paystack
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;