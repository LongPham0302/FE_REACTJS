import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from '../src/route/ProtectedRoute';
import './App.css';
import SignUp from './SignUp';
import Login from './login';
import UpdateUser from './updateProifieUser';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute />} />
          <Route path="/updateProfileUser" element={<UpdateUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
