import React, { useEffect, useState } from 'react';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

function Home() {

  const [credentialResponse, setCredentialResponse] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if(credentialResponse !== null) {
      var decoded = jwtDecode(credentialResponse.credential);
      console.log(decoded);
      setUser(decoded.name);
    }
  }, [credentialResponse])

  if(user) {
    console.log(user);
  }

  return (
    <div className="Home">
      <div className="home-contain">
        <div className="container items-decor shadow-lg">
          {user === null ? (
            <div className="container-items">
            <h3>Welcome to Weather Bot Admin Panel</h3>
            <h5>Please Login to access the dashboard</h5>
            <br></br>
            <div>
            <Login setCredentialResponse={setCredentialResponse}/>
            </div>
          </div>
          ) : (
            <div>
              {localStorage.setItem('user', user)}
              <Navigate to="/dashboard"/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home