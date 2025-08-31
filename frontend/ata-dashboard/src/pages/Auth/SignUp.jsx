import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastname: '',
    company: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validación de longitud de contraseña
    if (formData.password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.USERS_CREATE, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
          company: formData.company,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registro exitoso
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        // Manejo de errores específicos
        if (response.status === 400) {
          setErrorMsg(data.detail || 'El usuario ya existe o datos inválidos');
        } else if (response.status === 422) {
          // Error de validación
          if (Array.isArray(data.detail)) {
            const errors = data.detail.map(error => `${error.loc.join('.')}: ${error.msg}`).join(', ');
            setErrorMsg(`Errores de validación: ${errors}`);
          } else {
            setErrorMsg(data.detail || 'Datos inválidos');
          }
        } else {
          setErrorMsg(data.detail || 'Error al registrar usuario');
        }
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setErrorMsg('Error de conexión con el servidor. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Formulario de registro */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h2 className="text-3xl font-bold mb-2">Regístrate</h2>
        <p className="mb-6">
          ¿Ya tienes una cuenta?{' '}
          <span 
            onClick={handleLoginRedirect} 
            className="text-blue-700 font-bold cursor-pointer hover:underline"
          >
            Inicia sesión aquí
          </span>
        </p>

        {/* Mensaje de error */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            label="Correo electrónico" 
            name="email" 
            type="email" 
            icon={<FaEnvelope />} 
            value={formData.email}
            onChange={handleChange} 
            required
          />
          <Input 
            label="Nombre" 
            name="name" 
            type="text" 
            icon={<FaUser />} 
            value={formData.name}
            onChange={handleChange} 
            required
          />
          <Input 
            label="Apellido" 
            name="lastname" 
            type="text" 
            icon={<FaUser />} 
            value={formData.lastname}
            onChange={handleChange} 
            required
          />
          <Input 
            label="Empresa" 
            name="company" 
            type="text" 
            icon={<FaUser />} 
            value={formData.company}
            onChange={handleChange} 
            required
          />
          <Input 
            label="Contraseña" 
            name="password" 
            type="password" 
            icon={<FaLock />} 
            value={formData.password}
            onChange={handleChange} 
            required
            minLength={6}
          />
          <Input 
            label="Confirmar Contraseña" 
            name="confirmPassword" 
            type="password" 
            icon={<FaLock />} 
            value={formData.confirmPassword}
            onChange={handleChange} 
            required
            minLength={6}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-full shadow-md transition-colors"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
      </div>

      {/* Sección derecha con imagen de fondo */}
      <div 
        className="w-1/2 bg-[#010133] text-white flex flex-col justify-center items-center relative"
        style={{
          backgroundImage: 'url(/images.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay para mantener la legibilidad del texto */}
        <div className="absolute inset-0 bg-[#010133] bg-opacity-60"></div>
        
        {/* Contenido */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold">ATA-Dashboard</h1>
          <p className="mt-2">Únete a nosotros</p>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, name, type, icon, value, onChange, required, minLength }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex items-center border-b border-gray-400 py-2 focus-within:border-blue-500 transition-colors">
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="w-full bg-transparent focus:outline-none text-sm placeholder:text-gray-400"
        placeholder={`Ingresa tu ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

export default SignUp;
