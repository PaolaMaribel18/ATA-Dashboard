import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

import Pagination from './Pagination';


const allAlarms = [
  {
    id: 'Sensor 1',
    tipo: 'Temperatura alta',
    fecha: '12.09.2019 - 12.53 PM',
    accion: 'Notificacion enviada',
    estado: 'Resuelta',
  },
  {
    id: 'Sensor 2',
    tipo: 'Temperatura estable',
    fecha: '12.09.2019 - 12.53 PM',
    accion: 'Accion no necesaria',
    estado: 'Sin alerta',
  },
  {
    id: 'Sensor 3',
    tipo: 'Temperatura alta',
    fecha: '12.09.2019 - 12.53 PM',
    accion: 'Notificacion enviada',
    estado: 'Activa',
  },
  // Puedes añadir más registros si deseas
];

const statusColors = {
  Resuelta: 'bg-emerald-500',
  'Sin alerta': 'bg-yellow-400',
  Activa: 'bg-red-400',
};

const Alarms = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(allAlarms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlarms = allAlarms.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Alertas</h1>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Detalles</h2>
              <select className="text-sm text-gray-600 border rounded px-2 py-1">
                <option>October</option>
                {/* Puedes agregar más meses */}
              </select>
            </div>

            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3 text-left">Sensor ID</th>
                  <th className="px-6 py-3 text-left">Tipo de Alerta</th>
                  <th className="px-6 py-3 text-left">Fecha y Hora</th>
                  <th className="px-6 py-3 text-left">Acción Tomada</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {currentAlarms.map((alarm, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-4">{alarm.id}</td>
                    <td className="px-6 py-4">{alarm.tipo}</td>
                    <td className="px-6 py-4">{alarm.fecha}</td>
                    <td className="px-6 py-4">{alarm.accion}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${statusColors[alarm.estado]}`}
                      >
                        {alarm.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Alarms;
