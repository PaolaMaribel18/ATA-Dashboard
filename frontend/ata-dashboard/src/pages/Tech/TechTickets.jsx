import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaSyncAlt, FaTools } from 'react-icons/fa';

const TechTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updatingTicket, setUpdatingTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/tickets/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(response.data);
    } catch (err) {
      console.error('Error al obtener tickets:', err);
      setError('Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    setUpdatingTicket(ticketId);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Mapear los estados al formato que espera el backend
      const statusMap = {
        'in_progress': 'En Proceso',
        'closed': 'Cerrado',
        'open': 'Abierto'
      };
      
      const mappedStatus = statusMap[newStatus] || newStatus;
      
      console.log(`Actualizando ticket ${ticketId} a estado: ${mappedStatus}`);
      
      const response = await axios.patch(
        `http://localhost:8000/tickets/${ticketId}/status`, 
        {
          status: mappedStatus
        }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Respuesta del servidor:', response.data);
      setSuccess(`Ticket actualizado a ${mappedStatus}`);
      fetchTickets();
      
    } catch (err) {
      console.error('Error completo al actualizar ticket:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      
      if (err.response?.status === 400) {
        setError(`Error en la solicitud: ${err.response?.data?.detail || 'Estado inválido'}`);
      } else if (err.response?.status === 404) {
        setError('Ticket no encontrado');
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para actualizar este ticket');
      } else {
        setError(err.response?.data?.detail || 'Error al actualizar el ticket');
      }
    } finally {
      setUpdatingTicket(null);
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'abierto':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
      case 'in progress':
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'cerrado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="p-6 overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Cargando tickets...</div>
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
            <h1 className="text-2xl font-bold text-gray-800">Tickets Asignados</h1>
            <button
              onClick={fetchTickets}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSyncAlt />
              Actualizar
            </button>
          </div>

          {/* Mensajes de estado */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
            <div className="flex gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Filtrar por estado:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="open">Abiertos</option>
                <option value="in_progress">En Proceso</option>
                <option value="closed">Cerrados</option>
              </select>
              <span className="text-sm text-gray-500">
                Mostrando {filteredTickets.length} de {tickets.length} tickets
              </span>
            </div>
          </div>

          {/* Lista de tickets */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <FaTicketAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">No hay tickets asignados</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FaTicketAlt className="text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Ticket #{ticket.id.slice(-8)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{ticket.issue}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Sensor ID</p>
                      <p className="font-medium">{ticket.sensorId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha de creación</p>
                      <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                    </div>
                  </div>

                  {ticket.meeting && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-600" />
                        Reunión Programada
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Fecha y hora:</p>
                          <p className="font-medium">{formatDate(ticket.meeting.date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 flex items-center gap-1">
                            <FaMapMarkerAlt /> Ubicación:
                          </p>
                          <p className="font-medium">{ticket.meeting.location}</p>
                        </div>
                        {ticket.meeting.notes && (
                          <div className="md:col-span-2">
                            <p className="text-gray-600">Notas:</p>
                            <p className="font-medium">{ticket.meeting.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 justify-end">
                    {ticket.status !== 'En Proceso' && ticket.status !== 'in_progress' && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                        disabled={updatingTicket === ticket.id}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
                      >
                        <FaTools />
                        {updatingTicket === ticket.id ? 'Actualizando...' : 'Marcar En Proceso'}
                      </button>
                    )}
                    
                    {ticket.status !== 'Cerrado' && ticket.status !== 'closed' && (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'closed')}
                        disabled={updatingTicket === ticket.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                      >
                        ✓ {updatingTicket === ticket.id ? 'Actualizando...' : 'Marcar Completado'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechTickets;