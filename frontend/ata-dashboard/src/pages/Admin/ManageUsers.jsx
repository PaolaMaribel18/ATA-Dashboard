import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import CreateUser from './CreateUser'; 
import { FaUserPlus, FaSyncAlt } from 'react-icons/fa';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/users/all', { headers });
      setUsers(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios', err);
    }
  };

  const changeStatus = async (userId, status) => {
    try {
      await axios.patch(`http://localhost:8000/admin/users/${userId}/status?status=${status}`, {}, { headers });
      fetchUsers();
    } catch (err) {
      console.error('Error al cambiar estado', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                <FaUserPlus className="mr-2" /> Crear Usuario
              </button>
              <button
                onClick={fetchUsers}
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
                <th className="px-4 py-2">Empresa</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="px-4 py-2">{u.name} {u.lastname}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.company}</td>
                  <td className="px-4 py-2">{u.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    {u.status !== 'active' && (
                      <button onClick={() => changeStatus(u.id, 'active')} className="text-xs text-white bg-green-600 px-2 py-1 rounded">Activar</button>
                    )}
                    {u.status !== 'suspended' && (
                      <button onClick={() => changeStatus(u.id, 'suspended')} className="text-xs text-white bg-yellow-500 px-2 py-1 rounded">Suspender</button>
                    )}
                    {u.status !== 'deleted' && (
                      <button onClick={() => changeStatus(u.id, 'deleted')} className="text-xs text-white bg-red-600 px-2 py-1 rounded">Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <CreateUser
            onClose={() => setModalOpen(false)}
            onUserCreated={fetchUsers}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
