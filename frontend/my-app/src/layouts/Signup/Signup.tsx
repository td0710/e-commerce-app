import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Signin/signin.css";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import axios, { AxiosError } from "axios";
type Props = {};

type RegisterFormsInputs = {
  username: string;
  password: string;
  email: string;
};

const validation = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .matches(/@.+\../, "Invalid email format(e.g., example@domain.com)"),
});
export const Signup = (props: Props) => {
  const { registerUser } = useAuth();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [newOTP, setOTP] = useState("");
  const handleOTP = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("New OTP:", e.target.value);
    setOTP(e.target.value);
  };

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
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registrationData, setRegistrationData] =
    useState<RegisterFormsInputs | null>(null);

  const handleLogin = async (form: RegisterFormsInputs) => {
    const email = form.email;
    console.log(newOTP);
    const url = `${process.env.REACT_APP_API_URL}/api/auth/checkOTP`;
    const response = await axios.post(url, {
      OTP: newOTP,
      mail: email,
    });
    if (response.data === false) {
      setRegisterError("Invalid OTP");
      return;
    }
    console.log(response);
    try {
      await registerUser(form.username, form.password, form.email);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const errorMessage =
          (axiosError.response.data as any).message || "Unknown error occurred";
        setRegisterError(errorMessage);
      }
    }
  };

  const handleGetOtp = async (data: RegisterFormsInputs) => {
    setRegistrationData(data);

    try {
      console.log("kkkk");
      const url = `${process.env.REACT_APP_API_URL}/api/auth/getOTP`;
      await axios.post(url, { toEmail: data.email, username: data.username });
      setDisplayForm(true);
      setRegisterError("");
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const errorMessage =
          (axiosError.response.data as any).message || "Unknown error occurred";
        setRegisterError(errorMessage);
      }
    }
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
                {displayForm === false
                  ? "Hey, Enter your details to create a new account"
                  : "Enter the OTP sent to your email"}
              </p>
              {registerError && (
                <p className="error-message">{registerError}</p>
              )}
            </div>
            {displayForm === false && (
              <form
                className="user-details"
                onSubmit={handleSubmit(handleGetOtp)}
              >
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
                <button className="signin-btn" type="submit">
                  Sign up
                </button>
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
            )}
            {displayForm === true && (
              <form
                className="user-details"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (registrationData) {
                    handleLogin(registrationData);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="OTP"
                  className="name"
                  value={newOTP}
                  onChange={handleOTP}
                  required
                />
                <button className="signin-btn" type="submit">
                  Complete Sign Up
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
