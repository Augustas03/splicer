import { useNavigate } from "react-router-dom"

const Header = () =>{
    const navigate = useNavigate()

    const handleLoginClick = () => {
        navigate('/users/login');
    }
    const handleSignUpClick = () => {
        navigate('/users/signup');
    }
    return(
        <header>
            <nav>
                <div>
                     {/* Logo placeholder*/}
                     <div>Logo</div>
                </div>
            
                <div>
                    <button onClick={handleLoginClick}>Login</button>
                    <button onClick={handleSignUpClick}>Sign Up</button>
                </div>
            </nav>
        </header>
    )
}
export default Header