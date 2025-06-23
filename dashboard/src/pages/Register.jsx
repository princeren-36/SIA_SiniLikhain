import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const handleRoleSelect = (e) => {
    const role = e.target.value;
    if (role === "artisan") {
      navigate("/registerartisan");
    } else if (role === "buyer") {
      navigate("/registerbuyer");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100" style={{ fontFamily: 'Source Code Pro, monospace' }}>
      <div className="flex flex-col justify-center items-center w-full max-w-md bg-white shadow-lg p-8 mx-auto rounded-3xl m-4">
        <h1 className="text-4xl font-bold mb-4 text-black" style={{ fontFamily: 'Source Code Pro, monospace' }}>Register</h1>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Source Code Pro, monospace' }}>Create your account</h2>
        <div className="w-full mb-4">
          <label className="block mb-1 text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Source Code Pro, monospace' }}>Are you a/an?</label>
          <select
            name="role"
            defaultValue=""
            onChange={handleRoleSelect}
            className="w-full px-4 py-3 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white"
            style={{ fontFamily: 'Source Code Pro, monospace', fontWeight: 400 }}
          >
            <option value="" disabled>Select role...</option>
            <option value="artisan">Artisan</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Register;