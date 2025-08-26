import React, { useState } from 'react';
import { FaDownload, FaSpinner } from 'react-icons/fa';

const ReportDownloadButtons = ({ token }) => {
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const generateAndDownloadReport = async (format) => {
    setDownloading(format);
    setError(null);
    setSuccess(null);

    try {
      // Paso 1: Generar el reporte
      const generateResponse = await fetch('http://localhost:8000/reports/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parameters: {},
          format: format
        })
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.detail || 'Error al generar el reporte');
      }

      const reportData = await generateResponse.json();
      
      // Paso 2: Descargar el reporte usando el ID generado
      const downloadResponse = await fetch(`http://localhost:8000/reports/download/${reportData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!downloadResponse.ok) {
        throw new Error('Error al descargar el reporte');
      }

      // Paso 3: Procesar la descarga
      const blob = await downloadResponse.blob();
      
      if (blob.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }

      // Obtener el nombre del archivo desde los headers
      let fileName = `Reporte_${new Date().getTime()}`;
      const contentDisposition = downloadResponse.headers.get('content-disposition');
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (matches && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      } else {
        const extension = format === "pdf" ? "pdf" : "xlsx";
        fileName = `${fileName}.${extension}`;
      }

      // Crear y ejecutar la descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(`Archivo ${fileName} descargado exitosamente`);

    } catch (error) {
      console.error('Error al generar/descargar reporte:', error);
      setError(error.message || 'Error al procesar el reporte');
    } finally {
      setDownloading(null);
      // Limpiar mensajes después de 5 segundos
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          onClick={() => generateAndDownloadReport("pdf")}
          disabled={downloading !== null}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {downloading === "pdf" ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaDownload />
          )}
          {downloading === "pdf" ? 'Generando PDF...' : 'Descargar PDF'}
        </button>
        
        <button
          onClick={() => generateAndDownloadReport("excel")}
          disabled={downloading !== null}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {downloading === "excel" ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaDownload />
          )}
          {downloading === "excel" ? 'Generando Excel...' : 'Descargar Excel'}
        </button>
      </div>

      {/* Mensajes de estado */}
      {success && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReportDownloadButtons;