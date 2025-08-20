import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const CreateUser = ({ onClose, onUserCreated }) => {
    const [form, setForm] = useState({
        name: "",
        lastname: "",
        email: "",
        company: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert("Usuario creado!");
            setForm({ name: "", lastname: "", email: "", company: "", password: "" });
            if (onUserCreated) onUserCreated();
            onClose(); // cerrar modal
        } else {
            const error = await res.json();
            alert("Error: " + error.detail);
        }
    };

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Apellido"
                        value={form.lastname}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Empresa"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2 rounded"
                    >
                        Crear Usuario
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUser;
