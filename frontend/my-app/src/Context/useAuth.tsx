import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../models/UserProfile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signinAPI, signinGoogle, signupAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  login: boolean | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  loginGoogle: (usename: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  wishlistCount: number;
  updateWishlistCount: () => void;
  cartCount: number;
  updateCartCount: () => void;
  setlogin: () => void;
  orderCount: number;
  updateOrderCount: () => void;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [login, setLogin] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userId = decodedToken.id;
      localStorage.setItem("id", userId);
      setUser(JSON.parse(user));
      setToken(token);
    }
    setIsReady(true);
  }, [token]);
  const updateWishlistCount = async () => {
    const userId = localStorage.getItem("id");
    if (!userId || !token) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/wishlists/secure/total/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlistCount(response.data);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  const setlogin = () => {
    setLogin(true);
  };
  const updateOrderCount = async () => {
    const userId = localStorage.getItem("id");
    if (!userId || !token) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/orders/secure/total/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrderCount(response.data);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };
  const updateCartCount = async () => {
    const userId = localStorage.getItem("id");
    if (!userId || !token) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/carts/secure/total/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartCount(response.data);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };
  const registerUser = async (
    username: string,
    password: string,
    email: string
  ) => {
    await signupAPI(username, password, email)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("username", res.data?.userName);
          localStorage.setItem("email", res.data?.email);
          localStorage.setItem("role", res.data?.role);
          setLogin(true);
          setToken(res?.data.token!);
          setUser(userObj!);
          navigate("/homepage");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };
  const loginGoogle = async (username: string, password: string) => {
    await signinGoogle(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
          };
          console.log(res);
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("username", res.data?.userName);
          localStorage.setItem("email", res.data?.email);
          localStorage.setItem("role", res.data?.role);
          setLogin(true);
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login Success!");
          navigate("/homepage");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const loginUser = async (username: string, password: string) => {
    await signinAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            userName: res?.data.userName,
            email: res?.data.email,
          };
          console.log(res);
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("username", res.data?.userName);
          localStorage.setItem("email", res.data?.email);
          localStorage.setItem("role", res.data?.role);
          setLogin(true);
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login Success!");
          navigate("/homepage");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    setLogin(false);
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{
        orderCount,
        updateOrderCount,
        loginGoogle,
        login,
        loginUser,
        user,
        token,
        logout,
        isLoggedIn,
        registerUser,
        wishlistCount,
        updateWishlistCount,
        cartCount,
        updateCartCount,
        setlogin,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
