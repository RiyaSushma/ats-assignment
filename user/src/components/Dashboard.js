import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ManageBot from './ManageBot';
import Users from './Users';
import axios from 'axios';
import LogoutButton from './Logout';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const userLocalStorage = localStorage.getItem('user');
        const userLocalData = localStorage.getItem('userData');

        if (userLocalStorage) {
          console.log("user local storage: ", userLocalStorage);
          setUser(userLocalStorage);
        }
        if(userLocalData) {
          console.log("user storage: ", userLocalData);
          const parsedData = JSON.parse(userLocalData); 
          await axios.post('https://ats-assignment-1.onrender.com/auth', parsedData);
          console.log('User data posted successfully.');
        }
      } catch (error) {
        console.error('Error posting user data:', error);
      }
    };

    fetchUserData();
  }, []); 

  return (
    <div className="Dashboard">
      <div className="dashboard-contain">
        <div className="container items-dashboard-decor shadow-lg">
          {user ? (
            <div className="container-dashboard-items">
            <h3>Welcome {user}</h3>
          </div>
          ) : (
            <div className="container-dashboard-items">
            <h3>Welcome to Weather Bot Admin Panel</h3>
            </div>
          )}

          <div className="container-dashboard-items">
            <h5>Dashboard</h5>
            <LogoutButton/>
            <h4>Update Bot Settings</h4>
          </div>
          <ManageBot/>

          <div className="container-dashboard-items">
            <h5>Manage Subscribers</h5>
            </div>
            <Users/>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;