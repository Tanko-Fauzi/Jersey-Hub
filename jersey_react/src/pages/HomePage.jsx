import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaShieldAlt, FaFlag, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, activeFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.products);
      setFilteredProducts(data.products);
      // Initialize default sizes
      const defaultSizes = {};
      data.products.forEach(product => {
        defaultSizes[product._id] = 'M';
      });
      setSelectedSizes(defaultSizes);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const size = selectedSizes[product._id] || 'M';
    addToCart(product, 1, size);
    toast.success(`${product.team} ${product.name} (${size}) added to cart!`);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '20px',
        color: '#666'
      }}>
        <div>Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Section */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '12px 24px',
              background: activeFilter === 'all' ? '#1a1e24' : 'white',
              color: activeFilter === 'all' ? 'white' : '#1a1e24',
              border: 'none',
              borderRadius: '40px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            All Jerseys
          </button>
          <button
            onClick={() => setActiveFilter('club')}
            style={{
              padding: '12px 24px',
              background: activeFilter === 'club' ? '#1a1e24' : 'white',
              color: activeFilter === 'club' ? 'white' : '#1a1e24',
              border: 'none',
              borderRadius: '40px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <FaShieldAlt /> Club Teams
          </button>
          <button
            onClick={() => setActiveFilter('nation')}
            style={{
              padding: '12px 24px',
              background: activeFilter === 'nation' ? '#1a1e24' : 'white',
              color: activeFilter === 'nation' ? 'white' : '#1a1e24',
              border: 'none',
              borderRadius: '40px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <FaFlag /> National Teams
          </button>
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search for your team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '15px 20px',
              border: '1px solid #ddd',
              outline: 'none',
              fontSize: '1rem',
              borderRadius: '50px 0 0 50px'
            }}
          />
          <button style={{
            padding: '15px 25px',
            background: '#4CAF50',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '0 50px 50px 0'
          }}>
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <FaSearch style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }} />
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {filteredProducts.map(product => (
            <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                
                {/* Product Image Section */}
                <div style={{
                  height: '280px',
                  background: '#f5f7fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '20px'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    padding: '6px 12px',
                    borderRadius: '30px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: product.type === 'club' ? '#1a1e24' : '#e74c3c',
                    color: 'white',
                    zIndex: 1
                  }}>
                    {product.badge}
                  </span>
                  <img 
                    src={product.imageUrl} 
                    alt={`${product.team} ${product.name}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div style="text-align: center; color: #666;">
                          <div style="font-size: 48px; margin-bottom: 10px;">⚽</div>
                          <div style="font-size: 18px; font-weight: bold;">${product.team}</div>
                          <div style="font-size: 14px; margin-top: 5px;">${product.name}</div>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Product Info Section */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '5px' }}>
                    {product.name}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '12px' }}>
                    {product.team}
                  </p>
                  
                  {/* Size Selection */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      fontSize: '0.9rem', 
                      fontWeight: 600,
                      color: '#666'
                    }}>
                      Size:
                    </label>
                    <select 
                      value={selectedSizes[product._id] || 'M'}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSizes({
                          ...selectedSizes,
                          [product._id]: e.target.value
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        background: 'white'
                      }}
                    >
                      {product.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: '#1a1e24', 
                    marginBottom: '15px' 
                  }}>
                    GHS {product.price.toFixed(2)}
                  </div>
                  
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;