import React from 'react';
import { FaMoon, FaBell } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      {/* Título izquierdo */}
      <h2 className="text-xl font-semibold text-black">ATA - Dashboard</h2>

      {/* Íconos a la derecha */}
      <div className="flex items-center gap-6 text-gray-700">
        {/* Luna (modo oscuro) */}
        <FaMoon className="text-lg cursor-pointer hover:text-gray-900" />

        {/* Campana (notificaciones) con punto naranja */}
        <div className="relative cursor-pointer">
          <FaBell className="text-lg hover:text-gray-900" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
