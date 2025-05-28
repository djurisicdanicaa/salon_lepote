import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ReservationPage from './pages/ReservationPage';
import ReservationDetailsPage from './pages/ReservationDetailsPage';

import './styles/styles.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/reservation/details" element={<ReservationDetailsPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
