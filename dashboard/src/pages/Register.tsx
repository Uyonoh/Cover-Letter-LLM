// React Register Page (React + Vite)
// Save as Register.jsx or Register.tsx depending on your setup
import React from "react";
import { useState } from "react";
import axios from "axios";
import { APIRoot } from "../services/API";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post(APIRoot + "/auth/register", {
        email,
        password,
      });
      setMessage(res.data.msg || "Registration successful!");
      navigate("/user/login");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white text-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Signup
        </button>
        <p className="py-2 ">Aleady have an account? <Link to="/user/login" className="underline text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}
