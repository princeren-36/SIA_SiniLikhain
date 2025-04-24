import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import "../style/Loginn.css";

function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/Home");
    };

    return (
        <>
        <div className='login'>
            <div className='image'>
                <img src='../src/images/log.jpg' />
            </div>
            <div className='container-login'>
                <div>
                    <label htmlFor="user">Username</label>
                    <input type="text" id="user" name="user" />
                </div>
                <div>
                    <label htmlFor="pass">Password</label>
                    <input type="password" id="pass" name="pass" />
                </div>                
                <div>
                    <Button onClick={handleLogin} variant="contained">Login</Button>
                </div>
            </div>
        </div>
            
        </>
    );
}

export default Login;
