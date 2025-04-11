import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

const routes = [
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Router>,
];




const App = () => {
  return (
    <div>
      {routes}
    </div>
  );
};

export default App;