import React from 'react';

const ReportDownloadButtons = ({ token }) => {
  const downloadFile = async (format) => {
    try {
      const res = await fetch(`http://localhost:8000/reports/download/${format}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Error al descargar');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report.${format === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar reporte:', error);
    }
  };

  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={() => downloadFile("pdf")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Descargar PDF
      </button>
      <button
        onClick={() => downloadFile("excel")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Descargar Excel
      </button>
    </div>
  );
};

export default ReportDownloadButtons;
