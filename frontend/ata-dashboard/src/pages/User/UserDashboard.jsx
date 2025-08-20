// src/pages/User/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import SensorGauge from './SensorGauge';
import TendenciaLineChart from '../../components/TendenciaLineChart';
import axios from 'axios';

const UserDashboard = () => {
  const [sensors, setSensors] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const savedToken = localStorage.getItem('token');
        if (!savedToken) return;

        setToken(savedToken);

        const res = await axios.get('http://localhost:8000/sensors/mine', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        setSensors(res.data);
      } catch (error) {
        console.error('Error fetching sensors:', error);
      }
    };

    fetchSensors();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {sensors.length > 0 ? (
              sensors.map((sensor) => (
                <SensorGauge
                  key={sensor.id}
                  sensorId={sensor.id}
                  token={token}
                  label={`${sensor.type} - ${sensor.location}`}
                />
              ))
            ) : (
              <p>No tienes sensores registrados.</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6">
            <TendenciaLineChart data={sensors} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
