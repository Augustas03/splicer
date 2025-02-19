import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import AuthModal from '../components/authentication/AuthModal'
import { useAuth } from '../contexts/AuthContext';
import { logout }  from '../utils/auth'

const Header = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const { authUser, isLoggedIn } = useAuth();  // Get both authUser and isLoggedIn
  const [showDropdown, setShowDropdown] = useState(false);

  const handleOpenModal = (type) => {
    console.log(`Open ${type} Modal called`);
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Close Modal called");
    setShowModal(false);
    setModalType('');
  };

  const handleRouteBack = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header>
      <nav>
        <div className="h-17 flex justify-between items-center p-4 bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-30 border-b border-black-500 shadow font-poppins">
          <img
            src="logo.png"
            alt="Logo"
            className="h-24 w-auto z-40 transition duration-300 transform hover:scale-105 cursor-pointer"
            onClick={handleRouteBack}
          />
          {isLoggedIn ? (
            <div className="flex items-center relative">
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src="userTab.png"
                    alt={`${authUser?.email}'s profile`}
                    className="h-16 w-16 rounded-full cursor-pointer"
                  />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => navigate('/profile')}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 transition-colors duration-150"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex space-x-4 z-20">
              <button
                onClick={() => handleOpenModal('login')}
                style={{ backgroundColor: "#8C52FF" }}
                className="transform hover:translate-y-[-5px] border-none transition-all duration-300 bg-gray-500 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-white rounded outline-none focus:ring-2"
              >
                Login
              </button>
              <button
                onClick={() => handleOpenModal('signup')}
                style={{ backgroundColor: "#8C52FF" }}
                className="transform hover:translate-y-[-5px] border-none transition-all duration-300 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-white rounded outline-none focus:ring-2"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </nav>

      {!isLoggedIn && (
        <AuthModal 
          show={showModal} 
          onHide={handleCloseModal}
          modalType={modalType}
        />
      )}
    </header>
  );
};

export default Header;