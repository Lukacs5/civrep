// components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/apiService'; // Ensure this is the correct path

interface PrivateRouteProps {
  element: React.ReactNode; // Define the type for the 'element' prop
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = authService.isAuthenticated(); // Ellenőrizzük a hitelesítést

  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
