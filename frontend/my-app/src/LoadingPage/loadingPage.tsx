import { useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner";
import "./loadingpage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../Context/useAuth";
import { OAuthConfig } from "../configuration/configuration";

export const LoadingPage = () => {
  const navigate = useNavigate();
  const { token, setlogin, loginGoogle } = useAuth();
  interface CustomJwtPayload extends JwtPayload {
    email: string;
  }
  useEffect(() => {
    const authenticateGoogle = async () => {
      console.log(window.location.href);

      const authCodeRegex = /code=([^&]+)/;
      const isMatch = window.location.href.match(authCodeRegex);

      if (isMatch) {
        const authCode = decodeURIComponent(`${isMatch[1]}`);
        console.log(authCode);

        const url = `https://oauth2.googleapis.com/token`;

        console.log(OAuthConfig.authUri);

        const response = await axios.post(url, {
          client_id: `${OAuthConfig.clientId}`,
          client_secret: `${process.env.REACT_APP_GOOGLE_CLIENT_SECRET}`,
          code: `${authCode}`,
          grant_type: "authorization_code",
          redirect_uri: `${OAuthConfig.redirectUri}`,
        });
        console.log(response);
        const idToken = response.data.id_token;
        const decodedUser = jwtDecode<CustomJwtPayload>(idToken);
        const username = decodedUser.email;
        const url1 = `http://localhost:8080/api/auth/login/google`;

        loginGoogle(username, "");
      }
    };
    authenticateGoogle();
  }, []);
  return (
    <>
      <div className="centered-container">
        <h2 className="auth-text">Authenticated....</h2>
        <Spinner />
      </div>
    </>
  );
};
