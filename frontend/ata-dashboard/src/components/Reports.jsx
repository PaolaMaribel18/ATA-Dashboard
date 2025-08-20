import React from 'react';
import ReportsFilters from './ReportsFilters';
import ReportsTable from './ReportsTable';
import Sidebar from './Sidebar';
import Navbar from './Navbar';


const Reports = () => {


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Reportes</h1>
          <ReportsFilters />
          <ReportsTable />
        </main>
      </div>
    </div>
  );

};

export default Reports;
