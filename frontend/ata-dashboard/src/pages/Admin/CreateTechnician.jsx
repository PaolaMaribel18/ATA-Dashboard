import React, { useState } from 'react';
import axios from 'axios';

const CreateTechnician = ({ onClose, onTechnicianCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = async () => {
        // Validar campos vacíos
        const emptyFields = Object.entries(formData).filter(([, value]) => !value);
        if (emptyFields.length > 0) {
            const fieldNames = emptyFields.map(([k]) => k);
            alert(`Por favor completa todos los campos: ${fieldNames.join(', ')}`);
            return;
        }
        console.log("Datos a enviar:", formData);

        try {
            await axios.post('http://localhost:8000/technicians/create', formData, { headers });
            onTechnicianCreated(); // refrescar lista
            onClose(); // cerrar modal
        } catch (err) {
            console.error('Error al crear técnico:', err.response?.data || err.message);
            alert('Error al crear técnico');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Crear Técnico</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="Apellido"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                    <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500">Crear</button>
                </div>
            </div>
        </div>
    );
};

export default CreateTechnician;
