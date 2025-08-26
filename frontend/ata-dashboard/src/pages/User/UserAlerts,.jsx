import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaBell, FaExclamationTriangle, FaCheckCircle, FaSyncAlt, FaEye } from 'react-icons/fa';

const UserAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, resolved
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/alerts/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ordenar alertas por fecha de creación (más recientes primero)
      const sortedAlerts = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setAlerts(sortedAlerts);
    } catch (err) {
      console.error('Error al obtener alertas:', err);
      setError('Error al cargar las alertas');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no válida';
    }
  };

  // Función para obtener el color según la severidad
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener el icono según la severidad
  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-600" />;
      case 'info':
        return <FaBell className="text-blue-600" />;
      default:
        return <FaBell className="text-gray-600" />;
    }
  };

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.state === filter;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  // Estadísticas
  const activeAlertsCount = alerts.filter(alert => alert.state === 'active').length;
  const resolvedAlertsCount = alerts.filter(alert => alert.state === 'resolved').length;
  const criticalAlertsCount = alerts.filter(alert => 
    alert.state === 'active' && alert.severity === 'critical'
  ).length;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="p-6 overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Cargando alertas...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Alertas de Mis Sensores</h1>
            <button
              onClick={fetchAlerts}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <FaSyncAlt className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alertas Activas</p>
                  <p className="text-2xl font-bold text-gray-800">{activeAlertsCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Críticas</p>
                  <p className="text-2xl font-bold text-gray-800">{criticalAlertsCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resueltas</p>
                  <p className="text-2xl font-bold text-gray-800">{resolvedAlertsCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
            <div className="flex gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las alertas</option>
                <option value="active">Activas</option>
                <option value="resolved">Resueltas</option>
              </select>
              <span className="text-sm text-gray-500">
                Mostrando {filteredAlerts.length} de {alerts.length} alertas
              </span>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Lista de alertas */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {currentAlerts.length === 0 ? (
              <div className="text-center py-12">
                <FaBell className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? 'No tienes alertas en tus sensores' 
                    : `No hay alertas ${filter === 'active' ? 'activas' : 'resueltas'}`
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Severidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sensor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mensaje
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Creación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Resolución
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAlerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(alert.severity)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FaEye className="text-gray-400 text-sm" />
                              <span className="text-sm font-medium text-gray-900" title={alert.sensorId}>
                                {alert.sensorId.slice(-8)}...
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900 max-w-xs truncate" title={alert.message}>
                              {alert.message}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              alert.state === 'active' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {alert.state === 'active' ? 'Activa' : 'Resuelta'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(alert.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {alert.resolvedAt ? formatDate(alert.resolvedAt) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAlerts.length)} de {filteredAlerts.length} resultados
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Anterior
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-700">
                          Página {currentPage} de {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserAlerts;