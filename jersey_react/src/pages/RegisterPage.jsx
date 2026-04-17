import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '20px' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;