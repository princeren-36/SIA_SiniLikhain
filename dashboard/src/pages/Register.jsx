import React from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../images/6.jpg';

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
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center poppins-font"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />
      <button
        className="absolute top-6 left-6 z-20 bg-white/80 hover:bg-white text-black font-semibold px-4 py-2 rounded-full shadow border border-gray-300 transition-colors duration-200"
        onClick={() => navigate('/login')}
      >
        &#8592; Back
      </button>
      <div className="relative z-10 flex flex-col justify-center items-center w-full max-w-md bg-white/70 shadow-2xl p-8 mx-auto rounded-3xl m-4 backdrop-blur-md border border-white/30" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
        <h3 className="text-4xl font-bold mb-2 text-black" style={{ color: '#111' }}>Register Here</h3>
        <p className="text-base md:text-lg mt-2 font-medium text-black" style={{ color: '#222' }}>
          Artisan-made. Culture-inspired.
        </p>
        <div className="w-full flex justify-center">
          <p className="text-base text-black px-2 py-2 text-center font-medium mb-6" style={{ color: '#111', maxWidth: 400, background: 'none', boxShadow: 'none' }}>
            Join SiniLikhain and become part of a community that celebrates artisan-made, culture-inspired products. Choose your role to get started!
          </p>
        </div>
        <div className="w-full mb-4">
          <label className="block mb-1 text-black text-sm font-semibold" style={{ color: '#111' }}>Are you a/an?</label>
          <select
            name="role"
            defaultValue=""
            onChange={handleRoleSelect}
            className="w-full px-4 py-3 text-base text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-white poppins-font"
            style={{ fontWeight: 400, color: '#111' }}
          >
            <option value="" disabled className="poppins-font">Select role...</option>
            <option value="artisan" className="poppins-font">Artisan</option>
            <option value="buyer" className="poppins-font">Buyer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Register;