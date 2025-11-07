import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>শেকড় - The Kolkata Chronicle</h1>
      <p>Welcome to SEKOR-BKC Production System</p>
      <p>Status: Running ✅</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
