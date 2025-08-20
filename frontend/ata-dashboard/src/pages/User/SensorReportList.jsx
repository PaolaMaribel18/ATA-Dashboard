import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SensorReportCard from './SensorReportCard';

const SensorReportList = ({ token }) => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('http://localhost:8000/reports/summary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReport(res.data);
      } catch (err) {
        console.error('Error al obtener el reporte:', err);
      }
    };

    fetchReport();
  }, [token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {report.map(sensor => (
        <SensorReportCard key={sensor.sensorId} sensor={sensor} />
      ))}
    </div>
  );
};

export default SensorReportList;
