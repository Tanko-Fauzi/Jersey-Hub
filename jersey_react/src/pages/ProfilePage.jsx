import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div>
      <h1>My Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default ProfilePage;