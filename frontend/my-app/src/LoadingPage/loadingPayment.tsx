import { useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner";
import "./loadingpage.css";
import axios from "axios";

import { useAuth } from "../Context/useAuth";

export const LoadingPayment = () => {
  const navigate = useNavigate();
  const { token, setlogin, loginGoogle } = useAuth();
  return (
    <>
      <div className="centered-container">
        <h2 className="auth-text">Processing Payment....</h2>
        <Spinner />
      </div>
    </>
  );
};
