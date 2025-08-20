import React from 'react';

const SensorReportCard = ({ sensor }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-2">{sensor.sensorName}</h2>
      <ul className="text-sm space-y-1">
        <li><strong>Total lecturas:</strong> {sensor.totalReadings}</li>
        <li><strong>Promedio:</strong> {sensor.avg.toFixed(2)}</li>
        <li><strong>Mínimo:</strong> {sensor.min}</li>
        <li><strong>Máximo:</strong> {sensor.max}</li>
        <li><strong>Último valor:</strong> {sensor.lastValue}</li>
        <li><strong>Última lectura:</strong> {new Date(sensor.lastTimestamp).toLocaleString()}</li>
      </ul>
    </div>
  );
};

export default SensorReportCard;
