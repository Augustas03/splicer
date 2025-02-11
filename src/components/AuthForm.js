import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../db/dbConnection"
import { useAuth } from '../contexts/AuthContext';

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

  const [errors, setErrors] = useState({
    email: "",
    passwordErrors: [],
    confirmPassword: "",
  });

  function handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      [inputName]: inputValue,
    });

    if (inputName === "confirmPassword") {
      if (inputValue !== formData.password) {
        setErrors({
          ...errors,
          confirmPassword: "Passwords do not match",
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: "",
        });
      }
    }
  }

  const toggleHasAccount = () => {
    setHasAccount(!hasAccount);
  };

  async function onSubmit(e) {
    e.preventDefault();

    // Checking if passwords for signup match
    if(!hasAccount){
      if (formData.password !== formData.confirmPassword) {
        setErrors({
          ...errors,
          password: "Passwords do not match",
        });
        return;
      }
    }
    setIsLoading(true);

    //Checking firebase for user or Creating user 
  try{
    if(!hasAccount){
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

    const users = collection(db, "users");

    const userData = {
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
    };

    console.log("About to write user data:", userData);
    const myDoc = doc(users, user.uid);
    await setDoc(myDoc, userData);
    console.log("Successfully wrote to Firestore");

    await sendEmailVerification(user);
    alert("Success! Please verify your email before logging in.");
    window.location.reload()
    navigate("/")

    }else{
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
  
      setIsLoggedIn(true);
    }

    

  }catch (err) {
    console.error("Full error object:", err);
    const code = err.code;
    const message = err.message;

    if (code === "auth/email-already-in-use") {
      setErrors({
        ...errors,
        email: "Email already in use",
      });
    } else {
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
            title="Enter a password that contains atleast 7 characters and 1 uppercase letter"
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