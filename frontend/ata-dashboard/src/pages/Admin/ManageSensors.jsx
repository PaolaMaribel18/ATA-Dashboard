import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaMicrochip, FaSyncAlt, FaPlus } from 'react-icons/fa';
import CreateSensor from './CreateSensor'; // Asegúrate de tener este componente listo

const ManageSensors = () => {
  const [sensors, setSensors] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchSensors = async () => {
    try {
      const res = await axios.get('http://localhost:8000/sensors/all', { headers });
      setSensors(res.data);
    } catch (err) {
      console.error('Error al obtener sensores', err);
    }
  };

  const changeSensorStatus = async (sensorId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/sensors/admin/${sensorId}/status?status=${newStatus}`, {}, { headers });
      fetchSensors();
    } catch (err) {
      console.error('Error al cambiar estado del sensor', err);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Gestión de Sensores</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                <FaPlus className="mr-2" /> Crear Sensor
              </button>
              <button
                onClick={fetchSensors}
                className="flex items-center bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FaSyncAlt className="mr-2" /> Actualizar
              </button>
            </div>
          </div>

          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">Serial</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map(sensor => (
                <tr key={sensor.id} className="border-b">
                  <td className="px-4 py-2">{sensor.serial}</td>
                  <td className="px-4 py-2">{sensor.type}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sensor.status === 'online' ? 'bg-green-100 text-green-700' :
                      sensor.status === 'offline' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {sensor.status !== 'online' && (
                      <button
                        onClick={() => changeSensorStatus(sensor.id, 'online')}
                        className="text-xs text-white bg-green-600 px-2 py-1 rounded"
                      >
                        Activar
                      </button>
                    )}
                    {sensor.status !== 'offline' && (
                      <button
                        onClick={() => changeSensorStatus(sensor.id, 'offline')}
                        className="text-xs text-white bg-yellow-500 px-2 py-1 rounded"
                      >
                        Suspender
                      </button>
                    )}
                    {sensor.status !== 'deleted' && (
                      <button
                        onClick={() => changeSensorStatus(sensor.id, 'deleted')}
                        className="text-xs text-white bg-red-600 px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-xl relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold"
              >
                &times;
              </button>
              <CreateSensor
                onClose={() => setModalOpen(false)}
                onSensorCreated={() => {
                  fetchSensors();
                  setModalOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSensors;
