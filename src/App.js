import React from 'react';
import RouletteWheel from './components/RouletteWheel';
import './App.css';

function App() {
  return (
    <div className="container-fluid p-0 m-0 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
      <div className="mb-4">
        <h1 className="text-white">Prize Wheel</h1>
      </div>
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <RouletteWheel />
      </div>
    </div>
  );
}

export default App;
