import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/home/Home';
import Header from './pages/Header';
import UsersLayout from './layouts/UsersLayout';
import Edit from './pages/edit/Edit';
import Loader from './components/animation/Loader'; // Import the Loader component
import { AuthProvider } from '../src/contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  // Simulate loading state for demo (this can be replaced with actual loading logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loader after 800ms (adjust based on actual load time)
    }, 800);
    return () => clearTimeout(timer); // Cleanup timeout if component unmounts
  }, []);

  const DefaultLayout = ({ children }) => (
    <>
      <Header />
      {children}
    </>
  );

  return (
    <Router>
      <div>
        {/* Show the loader globally while isLoading is true */}
        {isLoading && <Loader />} 
        
        <section>
          <Routes>
            <AuthProvider>
              {/* Routes with Default Layout */}
            <Route path="/" element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            } />
            {/* Routes without Header */}
            <Route path="/edit" element={<Edit />} /> {/* Edit does not have DefaultLayout wrapper */}
            </AuthProvider>
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
