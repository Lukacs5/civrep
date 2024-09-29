// components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService'; 

interface PrivateRouteProps {
  element: React.ReactNode; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = authService.isAuthenticated(); 

  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
