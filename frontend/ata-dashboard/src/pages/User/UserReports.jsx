import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaDownload, FaSpinner } from 'react-icons/fa';

const UserReports = () => {
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);

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
      setError('Error al cargar el historial de reportes');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/reports/create',
        {
          parameters: {},
          format: format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess('Reporte generado exitosamente');
      fetchReportHistory(); // Actualizar el historial
    } catch (err) {
      console.error('Error al generar reporte:', err);
      setError(err.response?.data?.detail || 'Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId, reportFormat) => {
    setDownloadingId(reportId);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      console.log(`Descargando reporte: ${reportId}`);
      
      const response = await axios.get(
        `http://localhost:8000/reports/download/${reportId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': '*/*'
          },
          responseType: 'blob',
          timeout: 30000
        }
      );

      // Verificar que la respuesta sea válida
      if (!response.data || response.data.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }

      // Obtener el nombre del archivo desde los headers
      let fileName = `Reporte_${new Date().getTime()}`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      } else {
        const extension = reportFormat === 'pdf' ? 'pdf' : 'xlsx';
        fileName = `${fileName}.${extension}`;
      }

      // Crear blob y descargar
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 
              (reportFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess(`Archivo ${fileName} descargado exitosamente`);
      
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      
      if (err.response?.status === 500) {
        setError('Error interno del servidor. Revisa los logs del backend.');
      } else if (err.response?.status === 404) {
        setError('El reporte no fue encontrado en el servidor');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para descargar este reporte');
      } else if (err.response?.status === 400) {
        setError('ID de reporte inválido');
      } else if (err.code === 'ECONNABORTED') {
        setError('La descarga tardó demasiado tiempo');
      } else {
        setError(`Error al descargar el reporte: ${err.message}`);
      }
    } finally {
      setDownloadingId(null);
      // Limpiar mensajes después de 5 segundos
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  // Función para formatear la fecha correctamente
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no válida';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Reportes de Sensores</h1>

          {/* Sección de generación de reportes */}
          <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Generar Nuevo Reporte</h2>
            
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Formato de archivo
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>

            {/* Mensajes de estado */}
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Historial de reportes */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Historial de Reportes Generados</h2>
            
            {reportHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aún no has generado reportes.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportHistory.map((report) => (
                  <div 
                    key={report.id} 
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            Reporte {report.format.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Generado: {formatDate(report.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {report.id}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(report.id, report.format)}
                      disabled={downloadingId === report.id}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {downloadingId === report.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaDownload />
                      )}
                      {downloadingId === report.id ? 'Descargando...' : 'Descargar'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserReports;