import React, {useState} from "react";
import PageLayout from "../components/PageLayout/PageLayout";
import acmVoteLogo from "./../img/acm-logo-final.png";
import API from "../API";
import {notification} from "antd";
import storage, {history} from "../storage";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectToACMRegister = () => {
    window.location.href = "https://members.acmucsd.com/register";
  };

  const handleChange = (e) => {
    switch (e.target.id) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
    }
  };

  const handleSubmit = (e) => {
    API.loginUser(email, password)
      .then((loginResponse) => {
        if (loginResponse.data.error !== null) {
          notification.open({
            key: "login-500",
            message: "Error logging in",
            description: `${loginResponse.data.error}`,
          });
          return;
        }
        storage.set("token", loginResponse.data.token);
        window.location.href = "/";
      })
      .catch((error) => {
        notification.open({
          key: "login-500",
          message: "Error logging in",
          description: `${error.message}`,
        });
      });
    e.preventDefault();
  };

  return (
    <PageLayout>
      <img className="login-logo" src={acmVoteLogo} alt="Acm Logo" />
      <form onSubmit={handleSubmit}>
        <input
          id="email"
          value={email}
          onChange={handleChange}
          type="text"
          placeholder="Email"
        ></input>
        <input
          id="password"
          value={password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
        ></input>
        <a
          href="https://members.acmucsd.com/forgot-password"
          id="forgot-password"
        >
          Forgot Password?
        </a>
        <button type="submit" className="login-button sign-in-button">
          Sign in
        </button>
        <button
          className="login-button create-account-button"
          onClick={redirectToACMRegister}
        >
          Create New Account
        </button>
      </form>
    </PageLayout>
  );
}

export default Login;
