import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
import { passwordValidation, login, signup }  from '../../utils/auth'

const AuthForm = ({ initialHasAccount = true }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(initialHasAccount);
  const {isLoggedIn, setIsLoggedIn} = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  function handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      [inputName]: inputValue,
    });
  }

  const toggleHasAccount = () => {
    setHasAccount(!hasAccount);
  };

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    //Signup mode activated
    if(!hasAccount){
      //Checking if passwords match
      if(passwordValidation(formData)){
        try{
          //Calling signup function
          await signup(formData) 
          //Redirecting user to homepage after signup to login 
          window.location.reload()
        }catch(err){
          console.error("Full error object:", err);
          const code = err.code;
          const message = err.message;

          alert(`Error during sign up: ${message}`);
          console.log(code, message);
        }
      }
    }else{
      try{
        //Attempting to log user in
        if(await login(formData)){
          setIsLoggedIn(true);
        }
      }catch(err){
        console.error("Full error object:", err);
        const code = err.code;
        const message = err.message;
        alert(`Error during sign up: ${message}`);
        console.log(code, message);
      }
    }
  } 

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="text-xl mb-4">
          {hasAccount ? "Welcome back!" : "Looking forward to splicing tunes!"}
        </h2>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          required
          minLength={7}
          pattern="^(?=.*[A-Z]).{7,}$"
          title="Enter a password that contains atleast 7 characters and 1 uppercase letter"
        />
      </div>
      
      {!hasAccount && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
            minLength={7}
            pattern="^(?=.*[A-Z]).{7,}$"
            title="Confirm the above password"
          />
        </div>
      )}

      <button
        type="submit"
        className={`w-full text-white rounded py-2 px-4 bg-blue-500 hover:bg-blue-600`}
      >
        {hasAccount ? 'Login' : 'Sign Up'}
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={toggleHasAccount}
          className="text-blue-500 hover:text-blue-700"
        >
          {hasAccount ? 'Create an account here!' : 'Login here!'}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;