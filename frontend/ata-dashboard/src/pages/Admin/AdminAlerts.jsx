import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { FaExclamationTriangle } from 'react-icons/fa';

const AdminAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Traer todas las alertas
    const fetchAlerts = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8000/alerts/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Error al cargar alertas');
            }

            const data = await res.json();
            setAlerts(data);
        } catch (err) {
            setError(err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    // Marcar alerta como resuelta
    const resolveAlert = async (alertId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:8000/alerts/${alertId}/resolve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Error al resolver la alerta');
            }

            // Refrescar la lista después de resolver
            fetchAlerts();
        } catch (err) {
            alert(err.message || 'Error desconocido');
        }
    };

    if (loading) return <p>Cargando alertas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (alerts.length === 0) return <p>No hay alertas para mostrar.</p>;

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role="administrator" />
            <div className="flex flex-col flex-1">
                <Navbar role="administrator" />
                <div>
                    <h2 className="text-2xl font-bold mb-4">Supervisión de Alertas</h2>
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Sensor ID</th>
                                <th className="border px-4 py-2">Severidad</th>
                                <th className="border px-4 py-2">Mensaje</th>
                                <th className="border px-4 py-2">Estado</th>
                                <th className="border px-4 py-2">Creado</th>
                                <th className="border px-4 py-2">Resuelto</th>
                                <th className="border px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert) => (
                                <tr key={alert.id}>
                                    <td className="border px-4 py-2 text-sm">{alert.id}</td>
                                    <td className="border px-4 py-2 text-sm">{alert.sensorId}</td>
                                    <td className="border px-4 py-2 text-sm">{alert.severity}</td>
                                    <td className="border px-4 py-2 text-sm">{alert.message}</td>
                                    <td className="border px-4 py-2 text-sm">{alert.state}</td>
                                    <td className="border px-4 py-2 text-sm">{new Date(alert.createdAt).toLocaleString()}</td>
                                    <td className="border px-4 py-2 text-sm">{alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleString() : '-'}</td>
                                    <td className="border px-4 py-2 text-sm">
                                        {alert.state !== 'resolved' && (
                                            <button
                                                onClick={() => resolveAlert(alert.id)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Marcar como resuelta
                                            </button>
                                        )}
                                        {alert.state === 'resolved' && <span>✔️ Resuelta</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
            );
};

            export default AdminAlerts;
