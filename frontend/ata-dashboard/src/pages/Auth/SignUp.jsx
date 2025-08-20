import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        navigate('/login');
      } else {
        setErrorMsg(data.detail || 'Error al registrar usuario');
      }
    } catch {
      setErrorMsg('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center px-20">
        <h2 className="text-3xl font-bold mb-2">Regístrate</h2>
        <p className="mb-6">
          ¿Ya tienes una cuenta?{' '}
          <span onClick={() => navigate('/login')} className="text-blue-700 font-bold cursor-pointer">
            Inicia sesión aquí
          </span>
        </p>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Correo electrónico" name="email" type="email" icon={<FaEnvelope />} onChange={handleChange} />
          <Input label="Nombre" name="name" type="text" icon={<FaUser />} onChange={handleChange} />
          <Input label="Apellido" name="lastname" type="text" icon={<FaUser />} onChange={handleChange} />
          <Input label="Empresa" name="company" type="text" icon={<FaUser />} onChange={handleChange} />
          <Input label="Contraseña" name="password" type="password" icon={<FaLock />} onChange={handleChange} />
          <Input label="Confirmar Contraseña" name="confirmPassword" type="password" icon={<FaLock />} onChange={handleChange} />

          <button type="submit" className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-full shadow-md">
            Registrarse
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-[#010133] text-white flex flex-col justify-center items-center">
        <img src="src/assets/dashboard-svgrepo-com.svg" alt="Ilustración" className="w-3/4 mb-6 size-24" />
        <h1 className="text-3xl font-bold">ATA-Dashboard</h1>
        <p className="mt-2">Bienvenido/a</p>
      </div>
    </div>
  );
};

const Input = ({ label, name, type, icon, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <div className="flex items-center border-b border-gray-400 py-2">
      <span className="text-gray-500 mr-2">{icon}</span>
      <input
        name={name}
        type={type}
        onChange={onChange}
        required
        className="w-full bg-transparent focus:outline-none text-sm placeholder:text-gray-400"
        placeholder={label}
      />
    </div>
  </div>
);

export default SignUp;
