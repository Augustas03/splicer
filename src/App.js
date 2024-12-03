import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Header from './pages/Header'
import UsersLayout from './layouts/UsersLayout'
import Edit from './pages/Edit'

function App() {
  return (
    <Router>
      <div>
        <section>
            <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersLayout/>}>
              {/* Default redirect to login if in '/users' route by itself */}
              <Route index element={<Navigate to="/" replace/>}/>
              {/* Remove the /users/ prefix from child routes */}
              <Route path="login" element={<Login/>} />
              <Route path="signup" element={<Signup/>} />
            </Route>
            <Route path="edit" element={<Edit/>} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
