import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();

  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <FaShoppingCart style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '20px' }} />
        <h2>Your cart is empty</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>Add some jerseys to get started!</p>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '12px 30px',
          background: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: 600
        }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Shopping Cart ({getCartCount()} items)</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {cart.items.map(item => (
            <div key={item.product} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px 0',
              borderBottom: '1px solid #e0e4e8'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                background: '#f5f7fa',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '20px'
              }}>
                <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '5px' }}>{item.team} {item.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Size: <strong>{item.size}</strong>
                </p>
                <p style={{ color: '#4CAF50', fontWeight: 700, fontSize: '1.2rem' }}>
                  GHS {item.price.toFixed(2)}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e0e4e8', background: 'white', cursor: 'pointer' }}
                  >-</button>
                  <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e0e4e8', background: 'white', cursor: 'pointer' }}
                  >+</button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.product)}
                  style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span>Subtotal</span>
            <span>GHS {getCartTotal().toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingTop: '15px', borderTop: '2px solid #e0e4e8', fontSize: '1.3rem', fontWeight: 800 }}>
            <span>Total</span>
            <span>GHS {getCartTotal().toFixed(2)}</span>
          </div>
          
          <Link to="/checkout">
            <button style={{
              width: '100%',
              padding: '15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginTop: '20px'
            }}>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;