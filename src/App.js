import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/home/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Header from './pages/Header'
import UsersLayout from './layouts/UsersLayout'
import Edit from './pages/edit/Edit'

function App() {
  const DefaultLayout = ({ children }) => (
    <>
      <Header />
      {children}
    </>
  );

    return (
      <Router>
        <div>
          <section>
            <Routes>
              {/* Routes with header*/}
              <Route path="/" element={
                <DefaultLayout>
                  <Home />
                </DefaultLayout>
              } />
              <Route path="/users" element={
                <DefaultLayout>
                  <UsersLayout />
                </DefaultLayout>
              }>
                <Route index element={<Navigate to="/" replace />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
  
              {/* Routes without header*/}
              <Route path="/edit" element={<Edit />} />
            </Routes>
          </section>
        </div>
      </Router>
    );
}

export default App;
