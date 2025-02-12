import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home/Home';
import Header from './pages/Header';
//import UsersLayout from './layouts/UsersLayout';
import Edit from './pages/edit/Edit';
import Loader from './components/animation/Loader'; // Import the Loader component
import { AuthProvider } from '../src/contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const DefaultLayout = ({ children }) => (
    <>
      <Header />
      {children}
    </>
  );

  return (
    <Router>
      <AuthProvider>
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
            {/* Routes without Header */}
            <Route path="/edit" element={<Edit />} /> {/* Edit does not have DefaultLayout wrapper */} 
          </Routes>
        </section>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
