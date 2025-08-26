import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaTicketAlt, FaClock, FaCheckCircle, FaTools } from 'react-icons/fa';

const TechDashboard = () => {
  const [ticketsSummary, setTicketsSummary] = useState({
    open: [],
    in_progress: [],
    closed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTicketsSummary();
  }, []);

  const fetchTicketsSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/tickets/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicketsSummary(response.data);
    } catch (err) {
      console.error('Error al obtener resumen de tickets:', err);
      setError('Error al cargar el resumen');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="p-6 overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Cargando dashboard...</div>
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
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard de Técnico</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaTicketAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tickets Abiertos</p>
                  <p className="text-2xl font-bold text-gray-800">{ticketsSummary.open.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">En Proceso</p>
                  <p className="text-2xl font-bold text-gray-800">{ticketsSummary.in_progress.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cerrados</p>
                  <p className="text-2xl font-bold text-gray-800">{ticketsSummary.closed.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets urgentes */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tickets Abiertos Urgentes</h2>
            {ticketsSummary.open.length === 0 ? (
              <p className="text-gray-500">No hay tickets abiertos</p>
            ) : (
              <div className="space-y-3">
                {ticketsSummary.open.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">#{ticket.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600 truncate">{ticket.issue}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</p>
                      {ticket.meeting && (
                        <p className="text-xs text-blue-600">📅 {formatDate(ticket.meeting.date)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tickets en proceso */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tickets en Proceso</h2>
            {ticketsSummary.in_progress.length === 0 ? (
              <p className="text-gray-500">No hay tickets en proceso</p>
            ) : (
              <div className="space-y-3">
                {ticketsSummary.in_progress.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">#{ticket.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600 truncate">{ticket.issue}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</p>
                      {ticket.meeting && (
                        <p className="text-xs text-blue-600">📅 {formatDate(ticket.meeting.date)}</p>
                      )}
                    </div>
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

export default TechDashboard;