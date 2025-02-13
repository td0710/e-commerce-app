import dotenv from "dotenv";
dotenv.config();

export const OAuthConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
  redirectUri: process.env.REACT_APP_REDIRECT_URI || "",
  authUri: "https://accounts.google.com/o/oauth2/auth",
};
