import React from 'react';
import PageLayout from '../components/PageLayout/PageLayout';
import './style.css';

function Login() {

    const redirectToACMRegister = () => {
        window.location.href='https://members.acmucsd.com/register'
    }

    return (
        <PageLayout>
            <h1>acm vote</h1>
            <input type="text" placeholder="Email"></input>
            <input type="password" placeholder="Password"></input>
            <a href="https://members.acmucsd.com/forgot-password" id="forgot-password">Forgot Password?</a>
            <button className="login-button">Sign in</button>
            <button className="login-button" onClick={redirectToACMRegister}>Create New Account</button>
        </PageLayout>
    );
}

export default Login