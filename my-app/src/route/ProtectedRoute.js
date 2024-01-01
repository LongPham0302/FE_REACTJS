import React from 'react';
import { Navigate } from 'react-router-dom';
import ProfileUser from '../ProfileUser';

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = localStorage.getItem('key');
    return (
        isAuthenticated ? <ProfileUser /> : <Navigate to="/login" />
    );
};

export default ProtectedRoute;
