import React, { useState } from 'react';

const CreateSensor = ({ onClose, onSensorCreated }) => {
  const [formData, setFormData] = useState({
    serial: '',
    type: '',
    location: '',
    ownerUserId: '',
    thresholds: {
      min: '',
      max: ''
    }
  });

  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'min' || name === 'max') {
      setFormData((prev) => ({
        ...prev,
        thresholds: {
          ...prev.thresholds,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/sensors/create_by_admin', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          thresholds: {
            min: parseFloat(formData.thresholds.min),
            max: parseFloat(formData.thresholds.max)
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear sensor');
      }

      onSensorCreated(); // Refresca la tabla
      onClose(); // Cierra modal
    } catch (err) {
      console.error(err);
      alert('Error al crear sensor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Sensor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="serial"
            placeholder="Serial"
            value={formData.serial}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="type"
            placeholder="Tipo de sensor"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Ubicación"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="ownerUserId"
            placeholder="ID del usuario propietario"
            value={formData.ownerUserId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex space-x-4">
            <input
              type="number"
              name="min"
              placeholder="Threshold mínimo"
              value={formData.thresholds.min}
              onChange={handleChange}
              required
              className="w-1/2 px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="max"
              placeholder="Threshold máximo"
              value={formData.thresholds.max}
              onChange={handleChange}
              required
              className="w-1/2 px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSensor;
