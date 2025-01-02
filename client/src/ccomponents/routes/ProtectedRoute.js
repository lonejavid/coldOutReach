// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path as necessary

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? Component : <Navigate to="/" />;
};

export default ProtectedRoute;
