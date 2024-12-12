import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "../db/dbConnection";


function Signup() {
  const navigate = useNavigate();

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

  const [isLoading, setIsLoading] = useState(false);

  function checkPassword(password) {
    const passwordErrors = [];
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 7) {
      passwordErrors.push("Must be at least 7 characters");
    }
    if (!hasUpperCase) {
      passwordErrors.push("Must contain an uppercase character");
    }
    if (!hasNumber) {
      passwordErrors.push("Must contain a number");
    }

    return passwordErrors;
  }

  function handleInputChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      [inputName]: inputValue,
    });

    if (inputName === "password") {
      const passwordErrors = checkPassword(inputValue);
      setErrors({
        ...errors,
        passwordErrors: passwordErrors,
      });
    }

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

  async function onSubmit(e) {
    e.preventDefault();

    // Check confirm password
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        password: "Passwords do not match",
      });
      return;
    }

    // Final password check
    const remainingPasswordErrors = checkPassword(formData.password);
    if (remainingPasswordErrors.length > 0) {
      setErrors({
        ...errors,
        passwordErrors: remainingPasswordErrors,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting signup with:", formData.email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Signup successful:", userCredential);
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

      navigate("users/login");
    } catch (err) {
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

    setIsLoading(false);
  }

  return (
    <div className="relative h-screen bg-gray-100 text-black font-parkinsans">
      {/* Background Image with Blue Tint */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            'url("https://static.vecteezy.com/system/resources/thumbnails/007/439/278/small/cyberpunk-sci-fi-product-podium-showcase-in-empty-room-with-blue-and-pink-background-technology-and-entertainment-object-concept-3d-illustration-rendering-photo.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-white-100 opacity-50 z-0"></div>
      </div>

      <div className="absolute inset-0 z-10 bg-gray-50 min-h-screen flex items-center justify-center px-16 overflow-hidden">
        <div className="relative w-full max-w-lg">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full pt-40 mb-50 px-5">
        <h2 className="text-6xl font-semibold text-purple-800 mb-5 text-center">
          Create an Account
        </h2>

        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg"
        >
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {errors.passwordErrors.length > 0 && (
              <div className="text-red-500 text-sm mt-1">
                {errors.passwordErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <div className="mb-5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-300"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center">
            <NavLink
              to="/users/Login"
              className="text-purple-500 hover:text-purple-700"
            >
              Already have an account? Log in
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
