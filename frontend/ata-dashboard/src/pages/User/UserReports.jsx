import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';

const UserReports = () => {
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);

  useEffect(() => {
    fetchReportHistory();
  }, []);

  const fetchReportHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/reports/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportHistory(res.data);
    } catch (err) {
      console.error('Error al obtener historial:', err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/reports/create',
        {
          parameters: {},
          format: format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDownloadUrl(response.data.fileUrl);
      fetchReportHistory();
    } catch (err) {
      console.error(err);
      setError('Error al generar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="user" />
      <div className="flex flex-col flex-1">
        <Navbar role="user" />
        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Reportes de Sensores</h1>

          <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg mb-10">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Formato de archivo
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>

            {downloadUrl && (
              <div className="mt-4 text-green-600">
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  Descargar reporte
                </a>
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-600">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Historial de Reportes Generados</h2>
            {reportHistory.length === 0 ? (
              <p className="text-gray-500">Aún no has generado reportes.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {reportHistory.map((report, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">Formato: {report.format.toUpperCase()}</p>
                      <p className="text-xs text-gray-500">Generado: {new Date(report.createdAt).toLocaleString()}</p>
                    </div>
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      Descargar
                    </a>
                  </li>
            ))}
          </ul>
            )}
      </div>
    </main>
      </div >
    </div >
  );
};

export default UserReports;
