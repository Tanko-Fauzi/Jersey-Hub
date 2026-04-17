import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTshirt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
  const { getCartCount, getCartTotal } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a1e24 0%, #2d343e 100%)',
      color: 'white',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTshirt style={{ fontSize: '2rem', color: '#4CAF50' }} />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>JerseyHub</h1>
            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Premium Football Jerseys</span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          
          {user ? (
            <>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaUser /> {user.name}
              </Link>
              <button onClick={handleLogout} style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaUser /> Login
            </Link>
          )}

          <Link to="/cart" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '10px 20px',
            borderRadius: '40px',
            textDecoration: 'none',
            color: 'white',
            position: 'relative'
          }}>
            <FaShoppingCart />
            <span>Cart</span>
            {getCartCount() > 0 && (
              <>
                <span style={{
                  background: '#4CAF50',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px'
                }}>{getCartCount()}</span>
                <span style={{ fontWeight: 600, marginLeft: '5px' }}>${getCartTotal().toFixed(2)}</span>
              </>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;