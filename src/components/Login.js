import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../db/dbConnection";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all the mandatory fields");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      if (formData.password.length < 7) {
        throw new Error("Please enter a valid password");
      }

      const userCredentials = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      navigate("/"); // Redirect to home after successful login
    } catch (err) {
      const errorMessages = {
        "auth/user-not-found": "Invalid email or password",
        "auth/wrong-password": "Invalid email or password",
        "auth/too-many-requests":
          "Too many failed attempts. Please try again later.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/invalid-email": "Please enter a valid email address",
      };
      setError(errorMessages[err.code] || err.message);
    } finally {
      setIsLoading(false);
    }
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
          Login to Your Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg"
        >
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          
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
          </div>

          <div className="mb-5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-300"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-center">
            <NavLink
              to="/users/signup"
              className="text-purple-500 hover:text-purple-700"
            >
              Don't have an account? Sign up
            </NavLink>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
