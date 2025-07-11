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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/verify-email" element={<VerifyEmail />} />
        <Route path="/admin/forgot-auth" element={<ForgotAuth />} />
        <Route path="/admin/reset-auth" element={<ResetAuth />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/applications" element={<Applications />} />
        <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
      </Routes>
    </div>
  );
}

export default App;