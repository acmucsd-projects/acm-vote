import React from 'react';
import PageLayout from '../components/PageLayout/PageLayout';
import acmVoteLogo from './../img/acm-logo-final.png';
import './style.css';

function Login() {

    const redirectToACMRegister = () => {
        window.location.href='https://members.acmucsd.com/register'
    }

    return (
        <PageLayout>
            <img className="login-logo" src={acmVoteLogo} alt="Acm Logo"/>
            <input type="text" placeholder="Email"></input>
            <input type="password" placeholder="Password"></input>
            <a href="https://members.acmucsd.com/forgot-password" id="forgot-password">Forgot Password?</a>
            <button className="login-button sign-in-button">Sign in</button>
            <button className="login-button create-account-button" onClick={redirectToACMRegister}>Create New Account</button>
        </PageLayout>
    );
}

export default Login