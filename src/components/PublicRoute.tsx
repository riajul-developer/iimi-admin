import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;