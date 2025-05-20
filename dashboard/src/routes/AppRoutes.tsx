import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import GenerateLetter from '../pages/GenerateLetter';
import Letters from '../pages/Letters';

function AppRoutes() {
    return (
      <Routes>
        <Route path="/letters" element={<Letters />} />
        <Route path="/letters/generate-letter" element={<GenerateLetter />} />
        <Route path="/" element={<Home />} />
      </Routes>
    );
}

export default AppRoutes;