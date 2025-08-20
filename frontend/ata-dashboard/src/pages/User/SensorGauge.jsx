// src/components/SensorGauge.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PressureGauge from '../../components/PressureGauge';

const SensorGauge = ({ sensorId, token, label }) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestReading = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/sensor_readings/sensor/${sensorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const readings = res.data;
        if (readings.length > 0) {
          const last = readings[readings.length - 1];
          setValue(last.value);
        } else {
          setValue(0); // o null si prefieres mostrar algo distinto
        }
      } catch (err) {
        console.error('Error al obtener lecturas:', err);
        setValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestReading();
  }, [sensorId, token]);

  if (loading) {
    return (
      <div className="w-60 h-60 flex items-center justify-center bg-white rounded-xl shadow-md">
        <span className="text-gray-400 text-sm">Cargando...</span>
      </div>
    );
  }

  return <PressureGauge value={value} label={label} />;
};

export default SensorGauge;
