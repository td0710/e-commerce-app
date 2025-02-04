import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Signin/signin.css";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
type Props = {};

type RegisterFormsInputs = {
  username: string;
  password: string;
  email: string;
};

const validation = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().required("Email is required"),
});
export const Signup = (props: Props) => {
  const { registerUser } = useAuth();
  const [bgLoaded, setBgLoaded] = useState(false);

  document.title = "Amazon";

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });
  const handleBgLoad = () => {
    setBgLoaded(true);
  };
  const handleLogin = (form: RegisterFormsInputs) => {
    console.log(form);
    registerUser(form.username, form.password, form.email);
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
            <Link to="/signin">
              <button className="signup-btn">Sign in</button>
            </Link>
          </div>
        </div>
        <div className="background">
          <img
            src={require("../../imgs/login-BG.png")}
            className="BG1"
            onLoad={handleBgLoad}
          />
          <img
            src={require("../../imgs/login-BG2.png")}
            className="BG2"
            onLoad={handleBgLoad}
          />
        </div>
        <div className="main-form2">
          <div className="login-form">
            <div className="some-text">
              <p className="user">User Registration</p>
              <p className="user-desc">
                Hey, Enter your details to create a new account
              </p>
            </div>
            <form className="user-details" onSubmit={handleSubmit(handleLogin)}>
              <input
                type="text"
                placeholder="Name"
                className="name"
                {...register("username")}
                required
              />
              {errors.username && (
                <p className="error-message">{errors.username.message}</p>
              )}
              <input
                type="password"
                placeholder="Password"
                className="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
              <input
                type="email"
                placeholder="Enter Email"
                className="email"
                {...register("email")}
                required
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
              <button className="signin-btn">Sign up</button>
              <div className="extra-buttons">
                <p className="or">&#x2015; Or &#x2015;</p>
                <button className="google">
                  <p>Sign up with</p>
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
