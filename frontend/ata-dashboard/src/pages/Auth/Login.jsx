import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const Login = () => {
  const navigate = useNavigate();

  // Estados para inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // limpia errores previos

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);

        // Decodifica el token para obtener el rol
        const decoded = jwtDecode(data.access_token);
        const role = decoded.role;

        // Redirige según el rol
        if (role === 'administrator') {
          navigate('/admin/dashboard');
        } else if (role === 'user') {
          navigate('/user/dashboard');
        } else if (role === 'technician') {
          navigate('/tech/dashboard');
        } else {
          setErrorMsg('Rol no reconocido');
        }
      } else {
        setErrorMsg(data.detail || 'Error al iniciar sesión');
      }
    } catch {
      setErrorMsg('Error de conexión, intenta más tarde');
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="flex h-screen">
      {/* Sección Izquierda: Formulario */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h2 className="text-3xl font-bold mb-2">Iniciar Sesión</h2>
        <p className="mb-6">
          Si no tienes una cuenta{' '}
          <a
            href="#"
            onClick={handleSignupRedirect}
            className="text-blue-700 font-bold cursor-pointer"
          >
            <br />
            Regístrate aquí !
          </a>
        </p>

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Correo electrónico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="w-full bg-transparent focus:outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                className="w-full bg-transparent focus:outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mostrar mensaje de error si hay */}
          {errorMsg && (
            <p className="text-red-600 text-sm mt-2 font-semibold">{errorMsg}</p>
          )}

          {/* Recordarme y olvidé contraseña */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Recuérdame
            </label>
            <a href="#" className="hover:underline">
              Olvidaste tu contraseña
            </a>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-full shadow-md"
          >
            Iniciar sesión
          </button>
        </form>
      </div>

      {/* Sección Derecha: Ilustración */}
      <div className="w-1/2 bg-[#010133] text-white flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">ATA-Dashboard</h1>
        <p className="mt-2">Bienvenido/a</p>
      </div>
    </div>
  );
};

export default Login;
