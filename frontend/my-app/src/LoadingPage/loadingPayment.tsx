import { useNavigate } from "react-router-dom";
import Spinner from "../utils/Spinner";
import "./loadingpage.css";
import axios from "axios";

import { useAuth } from "../Context/useAuth";
import { useEffect, useRef, useState } from "react";
import PaymentVNPAYModel from "../models/VNPayPaymentModel";

export const LoadingPayment = () => {
  const [VnpayPayment, setVnpayPayment] = useState<PaymentVNPAYModel | null>(
    null
  );
  const navigate = useNavigate();
  const { token, setlogin, loginGoogle } = useAuth();

  const userId = localStorage.getItem("id");
  const cartItemId = localStorage.getItem("currentItem");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handlePayment = async () => {
      const url = `http://localhost:8080/api/payment/secure/vn-pay-callback`;
      const params = new URLSearchParams(window.location.search);

      const vnpPayDateString = params.get("vnp_PayDate") || "";
      const vnpPayDate = vnpPayDateString
        ? new Date(
            parseInt(vnpPayDateString.substring(0, 4), 10),
            parseInt(vnpPayDateString.substring(4, 6), 10) - 1,
            parseInt(vnpPayDateString.substring(6, 8), 10),
            parseInt(vnpPayDateString.substring(8, 10), 10) || 0,
            parseInt(vnpPayDateString.substring(10, 12), 10) || 0,
            parseInt(vnpPayDateString.substring(12, 14), 10) || 0
          )
        : null;

      try {
        const response = await axios.post(
          url,
          {
            userId: userId,
            cartItemId: cartItemId,
            vnpAmount: Number(params.get("vnp_Amount")) || 0,
            vnpBankCode: params.get("vnp_BankCode") || "",
            vnpBankTranNo: params.get("vnp_BankTranNo") || "",
            vnpCardType: params.get("vnp_CardType") || "",
            vnpPayDate: vnpPayDate,
            vnpResponseCode: params.get("vnp_ResponseCode") || "",
            vnpTmnCode: params.get("vnp_TmnCode") || "",
            vnpTransactionNo: params.get("vnp_TransactionNo") || "",
            vnpTransactionStatus: params.get("vnp_TransactionStatus") || "",
            vnpTxnRef: params.get("vnp_TxnRef") || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        navigate("/order");
      } catch (error) {
        console.error("Payment request failed:", error);
      }
    };

    handlePayment();
  }, []);

  return (
    <>
      <div className="centered-container">
        <h2 className="auth-text">Processing Payment....</h2>
        <Spinner />
      </div>
    </>
  );
};
