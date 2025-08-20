import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';

import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';



import UserDashboard from './pages/User/UserDashboard';
import UserProfile from './pages/User/Profile';
import UserReports from './pages/User/UserReports';

import PrivateRoute from './routes/PrivateRoute';


import Alerts from './components/Alerts';

import Support from './components/Support';
import CreateUser from './pages/Admin/CreateUser';
import ManageSensors from './pages/Admin/ManageSensors';
import ManageTechnicians from './pages/Admin/ManageTechnicians';
import ManageAlerts from './pages/Admin/ManageAlerts'; // o desde donde esté



const routes = [
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Admin routes */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/sensors" element={<ManageSensors />} />
        <Route path="/admin/tech" element={<ManageTechnicians />} />
        <Route path="/admin/alerts" element={<ManageAlerts />} />

      </Route>

      {/* User routes */}
      <Route element={<PrivateRoute allowedRoles={["user"]} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/reports" element={<UserReports />} />
        <Route path="/user/alertas" element={<Alerts />} />
        <Route path="/user/support" element={<Support />} />
      </Route>
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