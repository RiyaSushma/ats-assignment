import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import ManageBot from './ManageBot';
import Users from './Users';
import axios from 'axios';
import LogoutButton from './Logout';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [dataPosted, setDataPosted] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from local storage
        const userLocalStorage = localStorage.getItem('user');
        if (userLocalStorage) {
          console.log("User local storage:", userLocalStorage);
          setUser(JSON.parse(userLocalStorage));
        }

        // Check if user data needs to be posted
        const userLocalData = localStorage.getItem('userData');
        if (userLocalData) {
          const parsedData = JSON.parse(userLocalData);
          const email = parsedData.email;

          try {
            const response = await axios.get('https://ats-assignment-1.onrender.com/auth');
            const existingUsers = response.data;

            const emailExists = existingUsers.some(user => user.email === email);

            if (!emailExists) {
              await axios.post('https://ats-assignment-1.onrender.com/auth', parsedData);
              console.log('User data posted successfully.');
              setDataPosted(true); // Update state to reflect successful posting
            } else {
              console.log('Email already exists. Data will not be posted.');
            }
          } catch (error) {
            console.error('Error checking or posting user data:', error);
          }
        }
      } catch (error) {
        console.error('Error handling user data:', error);
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
              <h3>Welcome {user.name}</h3>
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
