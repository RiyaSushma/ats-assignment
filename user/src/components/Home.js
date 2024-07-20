import React, { useEffect, useState } from 'react';
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

function Home() {

  const [credentialResponse, setCredentialResponse] = useState(null);
  const [user, setUser] = useState(null);
  const [userLocalData, setUserLocalStorage] = useState(null);

  useEffect(() => {
    if(credentialResponse !== null) {
      var decoded = jwtDecode(credentialResponse.credential);
      console.log("data is: ", decoded);
      const name = decoded.name.replace(/"/g, "'");

      const decoded_data = {
        name: name,
        email: decoded.email,
        status: 'active'
      }
      console.log("decoded data is: ", JSON.stringify(decoded_data));

      setUserLocalStorage(JSON.stringify(decoded_data));
      localStorage.setItem('userData', JSON.stringify(decoded_data))
      setUser(name);
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
              {
                localStorage.setItem('user', user)
              }
              <Navigate to="/dashboard"/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home