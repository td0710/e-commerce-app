import axios from "axios";
import { UserProfileToken } from "../models/UserProfileToken";

const api = `${process.env.REACT_APP_API_URL}/api/auth/`;

export const signinAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    console.error("API error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Authentication failed!";
      throw new Error(errorMessage);
    }

    throw new Error("An unexpected error occurred!");
  }
};

export const signupAPI = async (
  username: string,
  password: string,
  email: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "register", {
      username: username,
      password: password,
      email: email,
    });
    return data;
  } catch (error) {
    console.error("API error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Register failed";
      throw new Error(errorMessage);
    }

    throw new Error("An unexpected error occurred!");
  }
};

export const signinGoogle = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(
      `${process.env.REACT_APP_API_URL}/api/auth/login/google`,
      {
        username: username,
        password: password,
      }
    );
    return data;
  } catch (error) {
    console.error("API error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Authentication failed!";
      throw new Error(errorMessage);
    }

    throw new Error("An unexpected error occurred!");
  }
};
