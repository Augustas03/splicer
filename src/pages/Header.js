import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Function to navigate to login page
  const navigateToLogin = () => {
    navigate("/Login");
  };

  // Function to navigate to signup page
  const navigateToSignup = () => {
    navigate("/Signup");
  };

  const handleRouteBack = () => {
    navigate("/");
  };

  return (
    <header>
      <nav>
  {/* Header */}
  <div className="h-17 flex justify-between items-center p-4 bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-30 border-b border-black-500 shadow font-poppins">

    {/* Logo in the top-left */}
    <img
      src="logo.png"
      alt="Logo"
      className="h-24 w-auto z-40 transition duration-300 transform hover:scale-105 cursor-pointer"
      onClick={handleRouteBack}
    />

          {/* Login and Signup in the top-right */}
          <div className="flex space-x-4 z-20">
            {/* Login Button */}
            <button
              onClick={navigateToLogin}
              className="transform hover:translate-y-[-5px]  border-none transition-all duration-300 bg-grey-500 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-black rounded outline-none focus:ring-2"
            >
              Login
            </button>
            {/* Signup Button */}
            <button
              onClick={navigateToSignup}
              style={{ backgroundColor: "#8C52FF" }}
              className="transform hover:translate-y-[-5px]  border-none transition-all duration-300 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-white rounded outline-none focus:ring-2"
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
