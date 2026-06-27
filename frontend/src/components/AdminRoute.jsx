import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  if (!user || !isAdmin()) return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
