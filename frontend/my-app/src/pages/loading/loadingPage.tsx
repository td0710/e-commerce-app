import Spinner from "../../components/Spinner";
import "../../asserts/css/loadingpage.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAuth } from "../../hooks/useAuth";
import { OAuthConfig } from "../../configuration/configuration";
import { error } from "console";

export const LoadingPage = () => {
  const { loginGoogle } = useAuth();
  interface CustomJwtPayload extends JwtPayload {
    email: string;
  }
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateGoogle = async () => {
      try {
        const authCodeRegex = /code=([^&]+)/;
        const isMatch = window.location.href.match(authCodeRegex);

        if (isMatch) {
          const authCode = decodeURIComponent(`${isMatch[1]}`);

          const url = `https://oauth2.googleapis.com/token`;
          console.log();
          const response = await axios.post(url, {
            client_id: `${OAuthConfig.clientId}`,
            client_secret: `${process.env.REACT_APP_GOOGLE_CLIENT_SECRET}`,
            code: `${authCode}`,
            grant_type: "authorization_code",
            redirect_uri: `${OAuthConfig.redirectUri}`,
          });

          const idToken = response.data.id_token;
          const decodedUser = jwtDecode<CustomJwtPayload>(idToken);
          const username = decodedUser.email;

          await loginGoogle(username, "");
        }
      } catch (error) {
        console.error("Login error:", error);

        let errorMessage = "Login failed. Please try again!";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        setLoginError(errorMessage);
      }
    };

    authenticateGoogle();
  }, []);

  return (
    <>
      {loginError && <h2 className="auth-text">{loginError}</h2>}
      <div className="centered-container">
        <h2 className="auth-text">Authenticated....</h2>
        <Spinner />
      </div>
    </>
  );
};
