import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDetail from './pages/DeliveryDetail';
import TrackingLookup from './pages/TrackingLookup';
import CustomerPortal from './pages/CustomerPortal';
import './index.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onAdminLogin={() => setIsAdmin(true)} />} />
        <Route path="/track" element={<TrackingLookup />} />
        <Route path="/portal/:trackingNumber" element={<CustomerPortal />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard onLogout={() => setIsAdmin(false)} /> : <Navigate to="/" />} />
        <Route path="/admin/delivery/:id" element={isAdmin ? <DeliveryDetail /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
