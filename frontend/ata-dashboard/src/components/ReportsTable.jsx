// src/components/ReportsTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReportsTable = ({ token }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:8000/reports/mine', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(res.data);
      } catch (error) {
        console.error('Error al obtener reportes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  if (loading) {
    return <div className="text-gray-500">Cargando reportes...</div>;
  }

  if (reports.length === 0) {
    return <div className="text-gray-400">No hay reportes disponibles.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Sensor</th>
            <th className="px-4 py-2">Mensaje</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{r.sensorName || '—'}</td>
              <td className="px-4 py-2">{r.message}</td>
              <td className="px-4 py-2 capitalize">{r.status}</td>
              <td className="px-4 py-2">
                {new Date(r.createdAt).toLocaleString('es-EC')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
