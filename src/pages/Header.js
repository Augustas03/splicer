import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import AuthModal from '../components/AuthModal';

const Header = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

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
        </div>
      </nav>

      <AuthModal 
        show={showModal} 
        onHide={handleCloseModal}
        modalType={modalType}
      />
    </header>
  );
};

export default Header;