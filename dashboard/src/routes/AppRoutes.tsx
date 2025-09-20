import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import GenerateLetter from '../pages/GenerateLetter';
import Letters from '../pages/Letters';
import Register from '../pages/Register';
import Login from '../pages/login';

function AppRoutes() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/letters" element={<Letters />} />
        <Route path="/letters/generate-letter" element={<GenerateLetter />} />
      </Routes>
    );
}

export default AppRoutes;