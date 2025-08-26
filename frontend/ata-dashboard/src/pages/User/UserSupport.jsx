import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { FaPlus, FaTicketAlt, FaCalendarAlt, FaClock, FaEye, FaSpinner } from 'react-icons/fa';

const UserSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state actualizado con todos los campos requeridos
  const [formData, setFormData] = useState({
    sensorId: '',
    issue: '',
    subject: '',
    description: '',
    priority: 'medium',
    meeting: {
      date: '',
      location: ''
    }
  });

  useEffect(() => {
    fetchTickets();
    fetchSensors();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/tickets/mine', {
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

  const fetchSensors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/sensors/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Sensores obtenidos:', response.data);
      setSensors(response.data);
    } catch (err) {
      console.error('Error al obtener sensores:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      
      if (err.response?.status === 404 || err.response?.status === 403) {
        setError('No tienes sensores disponibles para crear tickets');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('meeting.')) {
      const meetingField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        meeting: {
          ...prev.meeting,
          [meetingField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Verificar que la fecha de reunión sea futura
      const meetingDate = new Date(formData.meeting.date);
      const now = new Date();
      
      if (meetingDate <= now) {
        setError('La fecha de reunión debe ser futura');
        setCreating(false);
        return;
      }
      
      // Preparar los datos del ticket según el schema del backend
      const ticketData = {
        sensorId: formData.sensorId,
        issue: formData.issue,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        meeting: {
          date: meetingDate.toISOString(),
          location: formData.meeting.location
        }
      };

      console.log('Datos del ticket a enviar:', ticketData);

      const response = await axios.post('http://localhost:8000/tickets/create', ticketData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);

      setSuccess('Ticket de soporte creado exitosamente');
      setShowCreateForm(false);
      
      // Resetear formulario
      setFormData({
        sensorId: '',
        issue: '',
        subject: '',
        description: '',
        priority: 'medium',
        meeting: {
          date: '',
          location: ''
        }
      });
      
      fetchTickets();
    } catch (err) {
      console.error('Error completo al crear ticket:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      
      if (err.response?.status === 422) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          const errors = detail.map(error => `${error.loc.join('.')}: ${error.msg}`).join(', ');
          setError(`Errores de validación: ${errors}`);
        } else {
          setError(`Error de validación: ${detail || 'Datos inválidos'}`);
        }
      } else {
        setError(err.response?.data?.detail || 'Error al crear el ticket');
      }
    } finally {
      setCreating(false);
      
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
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
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'cerrado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensorName = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    return sensor ? `${sensor.serial} - ${sensor.type}` : 'Sensor desconocido';
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Soporte Técnico</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              Crear Ticket
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

          {/* Modal de creación de ticket */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Ticket de Soporte</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sensor *
                    </label>
                    <select
                      name="sensorId"
                      value={formData.sensorId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar sensor</option>
                      {sensors.map(sensor => (
                        <option key={sensor.id} value={sensor.id}>
                          {sensor.serial} - {sensor.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Asunto del ticket"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Problema (Resumen) *
                    </label>
                    <input
                      type="text"
                      name="issue"
                      value={formData.issue}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Resumen breve del problema"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción detallada *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe detalladamente el problema que estás experimentando..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha y hora preferida para reunión *
                    </label>
                    <input
                      type="datetime-local"
                      name="meeting.date"
                      value={formData.meeting.date}
                      onChange={handleInputChange}
                      required
                      min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación para reunión *
                    </label>
                    <input
                      type="text"
                      name="meeting.location"
                      value={formData.meeting.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dirección o ubicación del sensor"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {creating && <FaSpinner className="animate-spin" />}
                      {creating ? 'Creando...' : 'Crear Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lista de tickets */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <FaTicketAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">No tienes tickets de soporte</p>
                <p className="text-sm text-gray-400">Crea tu primer ticket para solicitar ayuda técnica</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sensor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Problema
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reunión Programada
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Creación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaTicketAlt className="text-blue-500" />
                            <span className="text-sm font-medium text-gray-900">
                              #{ticket.id.slice(-8)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaEye className="text-gray-400 text-sm" />
                            <span className="text-sm text-gray-900">
                              {getSensorName(ticket.sensorId)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 max-w-xs truncate" title={ticket.issue}>
                            {ticket.issue}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ticket.meeting ? (
                            <div className="text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <FaCalendarAlt className="text-gray-400" />
                                {formatDate(ticket.meeting.date)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                📍 {ticket.meeting.location}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No programada</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSupport;