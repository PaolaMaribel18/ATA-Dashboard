import React from 'react';
import { FaFilter, FaSyncAlt } from 'react-icons/fa';

const ReportsFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <FaFilter className="text-gray-600" />
        <span className="text-gray-700 font-medium">Filtrar Por</span>
      </div>
      <div className="flex-1 flex items-center gap-4">
        <select className="border px-3 py-1 rounded text-gray-600">
          <option>Fecha</option>
        </select>
        <select className="border px-3 py-1 rounded text-gray-600">
          <option>Sensor</option>
        </select>
        <select className="border px-3 py-1 rounded text-gray-600">
          <option>Estado</option>
        </select>
      </div>
      <button className="text-red-500 hover:text-red-600 flex items-center gap-1 ml-auto">
        <FaSyncAlt />
        Reiniciar filtro
      </button>
    </div>
  );
};

export default ReportsFilters;
