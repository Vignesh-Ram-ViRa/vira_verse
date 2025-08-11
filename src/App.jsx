import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import ProtectedLayout from './components/layouts/ProtectedLayout.jsx';
import Home from './screens/Home';
import About from './screens/About';
import Dashboard from './pages/Dashboard';
import PublicProjects from './pages/PublicProjects.jsx';
import PrivateProjects from './pages/PrivateProjects.jsx';
import Login from './pages/Login';
import TestDatabase from './pages/TestDatabase';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Authentication Route - No Header/Footer */}
          <Route path="/login" element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          } />
          
          {/* Protected Routes - With Header/Footer + Auth Check */}
          <Route path="/" element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } />
          
          <Route path="/public-projects" element={
            <ProtectedLayout>
              <PublicProjects />
            </ProtectedLayout>
          } />
          
          <Route path="/private-projects" element={
            <ProtectedLayout>
              <PrivateProjects />
            </ProtectedLayout>
          } />
          
          <Route path="/about" element={
            <ProtectedLayout>
              <About />
            </ProtectedLayout>
          } />
          
          <Route path="/test-database" element={
            <ProtectedLayout>
              <TestDatabase />
            </ProtectedLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;