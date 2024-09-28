import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleRegister = () => {
    navigate('/registration', { state: { mode: 'registration' } });
  };

  return (
    <div className="flex justify-between mb-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleRegister}
      >
        Új regisztráció
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogout}
      >
        Kijelentkezés
      </button>
    </div>
  );
};

export default Navbar;
