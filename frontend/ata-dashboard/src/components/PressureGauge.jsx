// src/components/PressureGauge.jsx
import React from 'react';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PressureGauge = ({ value = 780, min = 0, max = 1000, label = "Sensor" }) => {
  const percentage = (value / max) * 100;

  // Determinar color según el valor
  let color = '#3b82f6'; // azul por defecto (correcto)
  if (value <= 500) {
    color = '#ef4444'; // rojo
  } else if (value <= 750) {
    color = '#facc15'; // amarillo
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center w-60">
      <div style={{ width: 140, height: 140 }}>
        <CircularProgressbarWithChildren
          value={percentage}
          circleRatio={0.75}
          styles={buildStyles({
            rotation: 0.625,
            strokeLinecap: 'round',
            trailColor: '#f0f0f0',
            pathColor: color,
            textColor: '#1f2937',
          })}
        >
          <div className="text-center">
            <div className="text-lg font-medium text-gray-800">{value} hPa</div>
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="flex justify-between w-full text-xs text-gray-400 px-2 mt-1">
        <span>{min.toString().padStart(2, '0')}</span>
        <span>{max}</span>
      </div>
      <div className="mt-4 text-sm font-semibold text-gray-700 text-center">
        {label}
      </div>
    </div>
  );
};

export default PressureGauge;
