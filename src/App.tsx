import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
// import Register from './pages/Register';
// import ForgotAuth from './pages/ForgotAuth';
// import ResetAuth from './pages/ResetAuth';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ApplicationDetails from './pages/ApplicationDetails';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/applications" element={<Applications />} />
        <Route path="/admin/applications/:id" element={<ApplicationDetails />} />
        {/* <Route path="/register" element={<Register />} />
        <Route path="/forgot-auth" element={<ForgotAuth />} />
        <Route path="/reset-auth" element={<ResetAuth />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} /> */}
      </Routes>
    </div>
  );
}

export default App;