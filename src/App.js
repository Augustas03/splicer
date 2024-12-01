//import ComponentX from './components/ComponentX'
import React, {useState, useEffect} from 'react';
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import {BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path ='/login' element={<Login/>}></Route>
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
