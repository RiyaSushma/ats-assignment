import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Routes>
            <Route path ='/' exact element={<Home/>} />
            <Route path ='/dashboard' exact element={<Dashboard/>} />
          </Routes>
        </div>
      </header>
    </div>
  );
}

export default App;
