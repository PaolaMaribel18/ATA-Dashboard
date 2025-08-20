import React, { useState, useEffect } from 'react';
import {
  FaChartPie, FaFileAlt, FaBell, FaSignOutAlt, FaUserCircle,
  FaPhone, FaTools, FaUserCog, FaMicrochip, FaUsers, FaBars, 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  const [userInfo, setUserInfo] = useState({ name: 'User', role: 'user' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({ name: payload.name || 'User', role: payload.role });
      } catch {
        console.error('Token inválido');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItemsByRole = {
    user: [
      { name: 'Dashboard', icon: <FaChartPie />, route: '/user/dashboard' },
      { name: 'Reportes', icon: <FaFileAlt />, route: '/user/reports' },
      { name: 'Alertas', icon: <FaBell />, route: '/user/alerts' },
      { name: 'Soporte técnico', icon: <fa-screwdriver-wrench/>, route: '/user/soporte' },
    ],
    administrator: [
      { name: 'Dashboard', icon: <FaChartPie />, route: '/admin/dashboard' },
      { name: 'Usuarios', icon: <FaUsers />, route: '/admin/users' },
      { name: 'Sensores', icon: <FaMicrochip />, route: '/admin/sensors' },
      { name: 'Tecnicos', icon: <FaUsers />, route: '/admin/tech' },
      { name: 'Alertas', icon: <FaBell />, route: '/admin/alerts' },
    ],
    technician: [
      { name: 'Dashboard', icon: <FaChartPie />, route: '/tech/dashboard' },
      { name: 'Tareas asignadas', icon: <FaTools />, route: '/tech/tasks' },
    ],
    superadmin: [
      { name: 'Dashboard', icon: <FaChartPie />, route: '/superadmin/dashboard' },
      { name: 'Administradores', icon: <FaUserCog />, route: '/superadmin/admins' },
    ]
  };

  const menuItems = menuItemsByRole[userInfo.role] || [];

  return (
    <aside className={`h-full bg-white shadow-md flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div>
        {/* Toggle */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            <FaBars className="text-gray-600 text-xl" />
          </button>
        </div>

        {/* Usuario */}
        <div className={`flex items-center gap-4 px-4 py-6 border-b transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-300">
            <FaUserCircle className="text-2xl text-black" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs text-gray-400 tracking-widest uppercase">{userInfo.role}</p>
            <p className="text-base font-semibold text-black">{userInfo.name}</p>
          </div>
        </div>

        {/* Menú */}
        <nav className="mt-4 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setSelected(item.name);
                    navigate(item.route);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${selected === item.name
                    ? 'bg-white shadow-md text-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  {!isCollapsed && <span className="text-base">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600">
          <FaSignOutAlt className="mr-2 text-lg" />
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
