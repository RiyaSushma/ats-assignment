import { GoogleLogin } from '@react-oauth/google'
import React from 'react'

const Login = ({ setCredentialResponse }) => {
  return (
    <GoogleLogin 
        onSuccess={(credentialResponse) => {
            setCredentialResponse(credentialResponse);
            console.log(credentialResponse);
        }}
        onError={() => {
            console.log("Login failed");
        }}
    />
  )
}

export default Login;