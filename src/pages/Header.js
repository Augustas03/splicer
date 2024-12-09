import { useNavigate } from "react-router-dom"
const Header = () =>{
    const navigate = useNavigate()

    const handleRouteBack = () => {
        navigate('/');
    }

    return(
        <header>
            <nav>
                 {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-200 shadow-md fixed top-0 left-0 right-0 z-20">
        {/* Logo in the top-left */}
        <img src="logo.jpg" alt="Logo" className="h-16 w-auto z-20" onClick={handleRouteBack} />

        {/* Login and Signup in the top-right */}
        <div className="flex space-x-4 z-20">
            {/* need to link not only navigate to route but display actual <Login/> and SignUp look at UsersLayout.js and App.js for reference*/}
          <button className="transform hover:translate-y-[-5px] transition-all duration-300 bg-grey-500 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-black rounded outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
          <button  className="transform hover:translate-y-[-5px] transition-all duration-300 bg-blue-500 px-8 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-white rounded outline-none focus:ring-2 focus:ring-blue-500">
            Signup
          </button>
        </div>
      </div>
            
                {/* <div>
                    <button onClick={handleLoginClick}>Login</button>
                    <button onClick={handleSignUpClick}>Sign Up</button>
                </div> */}
            </nav>
        </header>
    )
}
export default Header