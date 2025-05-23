import { useState } from "react";
import "../../asserts/css/signin.css";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { OAuthConfig } from "../../configuration/configuration";
type Props = {};

type LoginFormsInputs = {
  username: string;
  password: string;
};

const handleClick = () => {
  const callbackUrl = process.env.REACT_APP_REDIRECT_URI;
  const authUrl = OAuthConfig.authUri;
  const googleClientId = OAuthConfig.clientId;

  const targetUrl = `${authUrl}?client_id=${googleClientId}&redirect_uri=${callbackUrl}&response_type=code&scope=openid%20email%20profile&prompt=consent`;

  window.location.href = targetUrl;
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

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (form: LoginFormsInputs) => {
    try {
      setLoginError(null);
      await loginUser(form.username, form.password);
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again!";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setLoginError(errorMessage);
    }
  };

  return (
    <>
      <div className="signin-page">
        <div className="login-navbar">
          <div className="main-logo">
            <img
              src={require("../../asserts/imgs/logo2.png")}
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
          <img
            src={require("../../asserts/imgs/login-BG.png")}
            className="BG1"
          />
          <img
            src={require("../../asserts/imgs/login-BG2.png")}
            className="BG2"
          />
        </div>

        <div className="main-form">
          <div className="login-form">
            <div className="some-text">
              <p className="user">User Login</p>

              <p className="user-desc">
                Hey, Enter your details to get sign in to your account
              </p>
              {loginError && <p className="error-message">{loginError}</p>}
            </div>
            <form className="user-details" onSubmit={handleSubmit(handleLogin)}>
              <input
                placeholder="Enter Username"
                className="email"
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
              {errors.username && (
                <p className="error-message">{errors.username.message}</p>
              )}
              <button className="signin-btn">Sign in</button>
              <div className="extra-buttons">
                <p className="or">&#x2015; Or &#x2015;</p>
                <button className="google" onClick={handleClick}>
                  <p>Sign in with</p>
                  <img
                    src={require("../../asserts/imgs/google.png")}
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
