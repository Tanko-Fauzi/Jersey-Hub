import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

const fetchProduct = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || '';
    const { data } = await axios.get(`${API_URL}/api/products/${id}`);
    setProduct(data);
    if (data?.sizes && data.sizes.length > 0) {
      setSelectedSize(data.sizes[0]);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to load product');
  } finally {
    setLoading(false);
  }
};

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    toast.success(`Added ${quantity} ${product.team} ${product.name} (${selectedSize}) to cart!`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div>Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          marginBottom: '30px', 
          padding: '10px 20px',
          background: 'none',
          border: '1px solid #ddd',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '16px'
        }}
      >
        <FaArrowLeft /> Back
      </button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
        {/* Product Image */}
        <div style={{
          background: '#f5f7fa',
          borderRadius: '20px',
          padding: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src={product.imageUrl} 
            alt={product.name}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '500px', 
              objectFit: 'contain' 
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="text-align: center; color: #666;">
                  <div style="font-size: 80px; margin-bottom: 20px;">⚽</div>
                  <div style="font-size: 24px; font-weight: bold;">${product.team}</div>
                  <div style="font-size: 18px; margin-top: 10px;">${product.name}</div>
                </div>
              `;
            }}
          />
        </div>
        
        {/* Product Details */}
        <div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: '30px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              background: product.type === 'club' ? '#1a1e24' : '#e74c3c',
              color: 'white',
              marginBottom: '15px'
            }}>
              {product.badge}
            </span>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
            {product.team}
          </h1>
          <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '20px' }}>
            {product.name}
          </h2>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555', marginBottom: '30px' }}>
            {product.description}
          </p>
          
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: '#4CAF50', 
            marginBottom: '30px' 
          }}>
            GHS {product.price.toFixed(2)}
          </div>
          
          {/* Size Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '1rem', 
              fontWeight: 600 
            }}>
              Select Size:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '12px 24px',
                    border: selectedSize === size ? '2px solid #4CAF50' : '1px solid #ddd',
                    borderRadius: '10px',
                    background: selectedSize === size ? '#4CAF50' : 'white',
                    color: selectedSize === size ? 'white' : '#333',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '16px',
                    minWidth: '70px'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity Selection */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '1rem', 
              fontWeight: 600 
            }}>
              Quantity:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  fontSize: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '20px', minWidth: '40px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  fontSize: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
              {product.stock} items in stock
            </p>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '18px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <FaShoppingCart /> Add to Cart - GHS {(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;