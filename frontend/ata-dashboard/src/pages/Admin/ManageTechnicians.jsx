import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CreateTechnician from './CreateTechnician';
import { FaUserPlus, FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';

const ManageTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [modalOpen, setModalOpen] = useState(false);


    const fetchTechnicians = async () => {
        try {
            const res = await axios.get('http://localhost:8000/technicians/all', { headers });
            setTechnicians(res.data);
        } catch (err) {
            console.error('Error al obtener técnicos', err);
        }
    };

    const changeStatus = async (techId, status) => {
        try {
            await axios.patch(`http://localhost:8000/admin/technicians/${techId}/status?status=${status}`, {}, { headers });
            fetchTechnicians();
        } catch (err) {
            console.error('Error al cambiar estado del técnico', err);
        }
    };

    useEffect(() => {
        fetchTechnicians();
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Gestión de Técnicos</h2>
                        <div className="flex gap-2">

                            <button
                                onClick={() => setModalOpen(true)}
                                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                            >
                                <FaUserPlus className="mr-2" /> Crear Técnico
                            </button>

                            <button
                                onClick={fetchTechnicians}
                                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                            >
                                <FaSyncAlt className="mr-2" /> Actualizar
                            </button>
                        </div>
                    </div>

                    <table className="w-full bg-white rounded shadow text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="px-4 py-2">Nombre</th>
                                <th className="px-4 py-2">Correo</th>
                                <th className="px-4 py-2">Teléfono</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {technicians.map((t) => (
                                <tr key={t.id} className="border-b">
                                    <td className="px-4 py-2">{t.name} {t.lastname}</td>
                                    <td className="px-4 py-2">{t.email}</td>
                                    <td className="px-4 py-2">{t.phone || '—'}</td>
                                    <td className="px-4 py-2">{t.status}</td>
                                    <td className="px-4 py-2 space-x-2">
                                        {t.status !== 'active' && (
                                            <button onClick={() => changeStatus(t.id, 'active')} className="text-xs text-white bg-green-600 px-2 py-1 rounded">Activar</button>
                                        )}
                                        {t.status !== 'suspended' && (
                                            <button onClick={() => changeStatus(t.id, 'suspended')} className="text-xs text-white bg-yellow-500 px-2 py-1 rounded">Suspender</button>
                                        )}
                                        {t.status !== 'deleted' && (
                                            <button onClick={() => changeStatus(t.id, 'deleted')} className="text-xs text-white bg-red-600 px-2 py-1 rounded">Eliminar</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {modalOpen && (
                    <CreateTechnician
                        onClose={() => setModalOpen(false)}
                        onTechnicianCreated={fetchTechnicians}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageTechnicians;
