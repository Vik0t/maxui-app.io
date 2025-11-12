import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentBoard from './pages/StudentBoard';
import FinanceSchema from './pages/Finance';
import CertificateSchema from './pages/Certificate';
import DeanLogin from './pages/DeanLogin';
import DeanBoard from './pages/DeanBoard';
import ApplicationsList from './pages/ApplicationsList';
import ApplicationDetails from './pages/ApplicationDetails';
import PaymentsList from './pages/PaymentsList';

const Main = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/student' element={<StudentBoard />} />
      <Route path='/finance' element={<FinanceSchema />} />
      <Route path='/certificate' element={<CertificateSchema />} />
      <Route path='/dean/login' element={<DeanLogin />} />
      <Route path='/dean/board' element={<DeanBoard />} />
      <Route path='/dean/applications/:type' element={<ApplicationsList />} />
      <Route path='/dean/applications/:type/:id' element={<ApplicationDetails />} />
      <Route path='/dean/payments' element={<PaymentsList />} />
    </Routes>
  );
}

export default Main;