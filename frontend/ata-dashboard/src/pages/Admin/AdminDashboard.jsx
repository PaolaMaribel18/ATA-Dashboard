import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaUserPlus, FaMicrochip, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DashboardAdmin = () => {
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [onlineSensorsCount, setOnlineSensorsCount] = useState(0);
  const [activeTechniciansCount, setActiveTechniciansCount] = useState(0);
  const [activeAlertsCount, setActiveAlertsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/users/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = res.data;
        const activeUsers = users.filter(user => user.status === 'active').length;
        setActiveUsersCount(activeUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setActiveUsersCount(0);
      }
    };

    const fetchSensors = async () => {
      try {
        const res = await axios.get('http://localhost:8000/sensors/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sensors = res.data;
        const onlineSensors = sensors.filter(sensor => sensor.status === 'online').length;
        setOnlineSensorsCount(onlineSensors);
      } catch (error) {
        console.error('Error fetching sensors:', error);
        setOnlineSensorsCount(0);
      }
    };

    const fetchTechnicians = async () => {
      try {
        const res = await axios.get('http://localhost:8000/technicians/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const technicians = res.data;
        const activeTechs = technicians.filter(t => t.status === 'active').length;
        setActiveTechniciansCount(activeTechs);
      } catch (error) {
        console.error('Error fetching technicians:', error);
        setActiveTechniciansCount(0);
      }
    };

    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:8000/alerts/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const alerts = res.data;
        const activeAlerts = alerts.filter(alert => alert.state === 'active').length;
        setActiveAlertsCount(activeAlerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setActiveAlertsCount(0);
      }
    };

    fetchUsers();
    fetchSensors();
    fetchTechnicians();
    fetchAlerts();

  }, []);

  const chartData = [
    { name: 'Usuarios', total: activeUsersCount },
    { name: 'Sensores', total: onlineSensorsCount },
    { name: 'Técnicos', total: activeTechniciansCount },
    { name: 'Alertas', total: activeAlertsCount }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="administrator" />
      <div className="flex flex-col flex-1">
        <Navbar role="administrator" />
        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Panel de Administrador</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-md flex items-center">
              <FaUserPlus className="text-blue-600 text-3xl mr-4" />
              <div>
                <p className="text-sm text-gray-500">Usuarios activos</p>
                <p className="text-xl font-bold text-gray-800">{activeUsersCount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md flex items-center">
              <FaMicrochip className="text-green-600 text-3xl mr-4" />
              <div>
                <p className="text-sm text-gray-500">Sensores en línea</p>
                <p className="text-xl font-bold text-gray-800">{onlineSensorsCount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md flex items-center">
              <FaUserPlus className="text-orange-500 text-3xl mr-4" />
              <div>
                <p className="text-sm text-gray-500">Técnicos activos</p>
                <p className="text-xl font-bold text-gray-800">{activeTechniciansCount}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md flex items-center">
              <FaChartLine className="text-purple-600 text-3xl mr-4" />
              <div>
                <p className="text-sm text-gray-500">Alertas activas</p>
                <p className="text-xl font-bold text-gray-800">{activeAlertsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen Gráfico</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
