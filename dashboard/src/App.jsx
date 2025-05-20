// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React from 'react';
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
