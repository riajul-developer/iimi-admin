import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetails from './pages/ApplicationDetails';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotAuth from './pages/ForgotAuth';
import ResetAuth from './pages/ResetAuth';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/admin/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin/verify-email" element={<VerifyEmail />} />
        <Route path="/admin/forgot-auth" element={<PublicRoute><ForgotAuth /></PublicRoute>} />
        <Route path="/admin/reset-auth" element={<PublicRoute><ResetAuth /></PublicRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/admin/applications/:id" element={<ProtectedRoute><ApplicationDetails /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;