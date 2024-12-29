import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/home/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './pages/Header';
import UsersLayout from './layouts/UsersLayout';
import Edit from './pages/edit/Edit';
import Loader from './components/Loader'; // Import the Loader component

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
            {/* Routes with Default Layout */}
            <Route path="/" element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            } />
            {/* userslayout.js for both pages */}
            <Route path="/users" element={ 
              <DefaultLayout>
                <UsersLayout />
              </DefaultLayout>
            }>
              <Route index element={<Navigate to="/users/login" replace />} /> {/* duplicate code */}
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            {/* Login and Signup with DefaultLayout */}
            <Route path="/login" element={
              <DefaultLayout>
                <Login />
              </DefaultLayout>
            } />
            <Route path="/signup" element={
              <DefaultLayout>
                <Signup />
              </DefaultLayout>
            } />

            {/* Routes without Header */}
            <Route path="/edit" element={<Edit />} /> {/* Edit does not have DefaultLayout wrapper */}
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
