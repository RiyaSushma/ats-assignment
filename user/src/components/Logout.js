import React from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import './Logout.css';


const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    googleLogout();
    console.log("pressed");
    localStorage.removeItem("user");
    navigate("/"); 
  };

  return (
    <>
      <div>
        <Button
          onClick={handleLogout}
          className="logoutButton"
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default LogoutButton;