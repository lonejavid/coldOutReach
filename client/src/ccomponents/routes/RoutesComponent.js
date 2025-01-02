import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landig from '../Landig'; 
import Sidebar from '../NextPage';
import AddFile from '../AddFile';
import ProtectedRoute from './ProtectedRoute';
import AddFileCustom from '../addFileCustom';
import SignupPage from '../signup';
import Login from '../login';
import VerificationSuccess from '../varification-success'

const RoutesComponent = () => (
  <Routes>
    {/* Public route for setting up email */}
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<Login/>} />
    <Route path="/" element={<Landig />} />
    <Route path="/add-file" element={<AddFile />} />

    {/* Protected route for Sidebar, requiring login */}
    <Route path="/next" element={<ProtectedRoute element={<Sidebar />} />} />
    <Route path="/verification-success" element={<VerificationSuccess />} />

    {/* Protected route for AddFileCustom page */}
    <Route 
      path="/AddFileCustom" 
      element={<ProtectedRoute element={<AddFileCustom />} />} 
    />
    
  </Routes>
);

export default RoutesComponent;
