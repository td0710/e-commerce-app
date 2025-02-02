import { useState } from "react";
import React from "react";
import "./signin.css";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "../../Context/useAuth";
import { UserProfileToken } from "../../models/UserProfileToken";
import axios from "axios";

type Props = {};

type LoginFormsInputs = {
  username: string;
  password: string;
};

const validation = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
export const Signin = (props: Props) => {
  const { loginUser } = useAuth();
  const { logout } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    loginUser(form.username, form.password);
  };

  return (
    <>
      <div className="signin-page">
        <div className="login-navbar">
          <div className="main-logo">
            <img
              src={require("../../imgs/logo2.png")}
              className="amazon-logo"
            />
          </div>
          <div className="signup">
            <Link to="/signup">
              <button className="signup-btn">Sign up</button>
            </Link>
          </div>
        </div>
        <div className="background">
          <img src={require("../../imgs/login-BG.png")} className="BG1" />
          <img src={require("../../imgs/login-BG2.png")} className="BG2" />
        </div>
        <div className="main-form">
          <div className="login-form">
            <div className="some-text">
              <p className="user">User Login</p>
              <p className="user-desc">
                Hey, Enter your details to get sign in to your account
              </p>
            </div>
            <form className="user-details" onSubmit={handleSubmit(handleLogin)}>
              <input
                placeholder="Enter Email"
                className="email"
                {...register("username")}
                required
              />
              {errors.username && (
                <p className="error-message">{errors.username.message}</p>
              )}
              <input
                type="password"
                placeholder="Passcode"
                className="password"
                {...register("password")}
              />
              {errors.username && (
                <p className="error-message">{errors.username.message}</p>
              )}
              <button className="signin-btn">Sign in</button>
              <div className="extra-buttons">
                <p className="or">&#x2015; Or &#x2015;</p>
                <button className="google">
                  <p>Sign in with</p>
                  <img
                    src={require("../../imgs/google.png")}
                    className="google-img"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
