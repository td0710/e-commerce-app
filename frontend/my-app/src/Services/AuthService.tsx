import axios from "axios";
import { UserProfileToken } from "../models/UserProfileToken";

const api = "http://localhost:8080/api/auth/";

export const signinAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "login", {
      username: username,
      password: password,
    });
    console.log(data);
    return data;
  } catch (error) {}
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
  } catch (error) {}
};

export const signinGoogle = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(
      "http://localhost:8080/api/auth/login/google",
      {
        username: username,
        password: password,
      }
    );
    console.log(data);
    return data;
  } catch (error) {}
};
