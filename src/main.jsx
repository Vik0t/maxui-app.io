import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import FinanceSchema from './pages/Finance';

const Main = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/finance' element={<FinanceSchema />} />
    </Routes>
  );
}

export default Main;