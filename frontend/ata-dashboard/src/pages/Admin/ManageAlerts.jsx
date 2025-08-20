import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaSyncAlt, FaCheckCircle, FaUndo, FaEye } from 'react-icons/fa';

const ManageAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/alerts/all', { headers });
      setAlerts(res.data);
    } catch (err) {
      console.error('Error al obtener alertas', err);
    }
  };

  const fetchSensors = async () => {
    try {
      const res = await axios.get('http://localhost:8000/sensors/all', { headers });
      setSensors(res.data);
    } catch (err) {
      console.error('Error al obtener sensores', err);
    }
  };

  const markAsResolved = async (alertId) => {
    const confirm = window.confirm('¿Deseas marcar esta alerta como resuelta?');
    if (!confirm) return;

    try {
      await axios.patch(`http://localhost:8000/alerts/${alertId}/resolve`, {}, { headers });
      fetchAlerts();
    } catch (err) {
      console.error('Error al resolver alerta:', err);
    }
  };

  const markAsActive = async (alertId) => {
    const confirm = window.confirm('¿Deseas volver a activar esta alerta?');
    if (!confirm) return;

    try {
      await axios.patch(`http://localhost:8000/alerts/${alertId}/activate`, {}, { headers });
      fetchAlerts();
    } catch (err) {
      console.error('Error al activar alerta:', err);
    }
  };

  const getSensorSerial = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? sensor.serial : 'Desconocido';
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString('es-EC', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchAlerts();
    fetchSensors();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.state === filter;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Supervisión de Alertas</h2>
            <div className="flex gap-2 items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="resolved">Resueltas</option>
              </select>
              <button
                onClick={fetchAlerts}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                <FaSyncAlt className="mr-2" /> Actualizar
              </button>
            </div>
          </div>

          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Sensor</th>
                <th className="px-4 py-2">Severidad</th>
                <th className="px-4 py-2">Mensaje</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Creado</th>
                <th className="px-4 py-2">Resuelto</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span title={a.sensorId} className="cursor-help text-blue-700 font-medium">
                      {getSensorSerial(a.sensorId)} <FaEye className="inline text-xs" />
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{a.severity}</td>
                  <td className="px-4 py-3 whitespace-pre-wrap">{a.message}</td>
                  <td className="px-4 py-3">
                    {a.state === 'resolved' ? (
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Resuelta</span>
                    ) : (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Activa</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDate(a.createdAt)}</td>
                  <td className="px-4 py-3">{a.resolvedAt ? formatDate(a.resolvedAt) : '-'}</td>
                  <td className="px-4 py-3">
                    {a.state === 'active' ? (
                      <button
                        onClick={() => markAsResolved(a.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-500"
                      >
                        Marcar como resuelta
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsActive(a.id)}
                        className="flex items-center bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                      >
                        <FaUndo className="mr-1" /> Volver activa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAlerts;
