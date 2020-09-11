import React from 'react';
import PageLayout from '../components/PageLayout/PageLayout';
import './style.css';

function Login() {
    return (
        <PageLayout>
            <h1>acm vote</h1>
            <input type="text" placeholder="Email"></input>
            <input type="password" placeholder="Password"></input>
            <a href="#" id="forgot-password">Forgot Password?</a>
            <input type="button" value="Sign In"/>
            <input type="button" value="Create New Account" onClick="window.location = 'https://members.acmucsd.com/login';"/>
        </PageLayout>
    );
}

export default Login