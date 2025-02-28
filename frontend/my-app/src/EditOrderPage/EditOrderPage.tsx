import axios, { AxiosError } from "axios";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { ChangeEvent, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import "../PaymentPage/payment.css";
import "../OrderPage/orders.css";
import OrderModel from "../models/OrderModel";
import Swal from "sweetalert2";

export const EditOrderPage = () => {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [order, setOrderItem] = useState<OrderModel | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice, cartItems } = location.state || {};

  const [shippingDisplay, setShippingDisplay] = useState("block");
  const [cardDisplay, setCardDisplay] = useState("none");
  const [isDisabled, setDisabled] = useState(false);

  const [OrderID] = useState("12345XYZ");
  const [Name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [Country, setCountry] = useState("");
  const [Number, setNumber] = useState("");
  const [Email, setEmail] = useState("");

  const [NameError, setNameError] = useState("");
  const [AddressError, setAddressError] = useState("");
  const [CountryError, setCountryError] = useState("");

  const [NumberError, setNumberError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [error, setError] = useState("");
  const { orderId } = useParams();

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleAddress = (e: ChangeEvent<HTMLInputElement>) =>
    setAddress(e.target.value);
  const handleCountry = (e: ChangeEvent<HTMLInputElement>) =>
    setCountry(e.target.value);
  const handleNumber = (e: ChangeEvent<HTMLInputElement>) =>
    setNumber(e.target.value);
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  console.log(totalPrice);
  const notify1 = () => alert("Vui lòng nhập đầy đủ thông tin!");
  const saveShippingDetails = async () => {
    const url = `http://localhost:8080/api/orders/secure/edit/${orderId}`;
    const shippingDetails = {
      userId: userId,
      country: Country,
      name: Name,
      contactNumber: Number,
      email: Email,
      homeAddress: Address,
    };

    try {
      const response = await axios.put(url, shippingDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Saved successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "Something went wrong!";

      if (axiosError.response && typeof axiosError.response.data === "object") {
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      }

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#F44336",
      });
    }
  };

  useEffect(() => {
    const fetchShippingDetails = async () => {
      try {
        const url = `http://localhost:8080/api/orders/secure/get/${orderId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data) {
          const loadedOrder = {
            orderId: response.data.orderId,
            totalPrice: response.data.totalPrice,
            quantity: response.data.quantity,
            size: response.data.size,
            color: response.data.color,
            shippingName: response.data.shippingName,
            shippingAddress: response.data.shippingAddress,
            shippingCountry: response.data.shippingCountry,
            shippingEmail: response.data.shippingEmail,
            productName: response.data.productName,
            productCategory: response.data.productCategory,
            productImg: response.data.productImg,
            status: response.data.status,
            paymentStatus: response.data.paymentStatus,
          };

          setOrderItem(loadedOrder);

          setName(response.data.shippingName);
          setAddress(response.data.shippingAddress);
          setCountry(response.data.shippingCountry);
          setNumber(response.data.contactNumber);
          setEmail(response.data.shippingEmail);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Could not fetch cart!");
        } else {
          setError("Unexpected error!");
        }
        console.error("Error fetching cart:", error);
      }
    };

    fetchShippingDetails();
  }, [orderId, token]);

  const cancelOrder = async () => {
    const fetchRefund = `http://localhost:8080/api/payment/secure/get/refund/${orderId}`;

    try {
      const response = await axios.post(
        fetchRefund,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      const url =
        "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

      console.log(
        response.data.vnp_RequestId,
        response.data.vnp_Version,
        response.data.vnp_Command,
        response.data.vnp_TmnCode,
        response.data.vnp_TransactionType,
        response.data.vnp_TxnRef,
        response.data.vnp_Amount,
        response.data.vnp_TransactionNo,
        response.data.vnp_TransactionDate,
        response.data.vnp_CreateBy,
        response.data.vnp_CreateDate,
        response.data.vnp_IpAddr,
        response.data.vnp_OrderInfo,
        response.data.vnp_SecureHash
      );
      const response1 = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vnp_RequestId: `${response.data.vnp_RequestId}`,
          vnp_Version: `${response.data.vnp_Version}`,
          vnp_Command: `${response.data.vnp_Command}`,
          vnp_TmnCode: `${response.data.vnp_TmnCode}`,
          vnp_TransactionType: `${response.data.vnp_TransactionType}`,
          vnp_TxnRef: `${response.data.vnp_TxnRef}`,
          vnp_Amount: `${response.data.vnp_Amount}`,
          vnp_TransactionNo: `${response.data.vnp_TransactionNo}`,
          vnp_TransactionDate: `${response.data.vnp_TransactionDate}`,
          vnp_CreateBy: `${response.data.vnp_CreateBy}`,
          vnp_CreateDate: `${response.data.vnp_CreateDate}`,
          vnp_IpAddr: `${response.data.vnp_IpAddr}`,
          vnp_OrderInfo: `${response.data.vnp_OrderInfo}`,
          vnp_SecureHash: `${response.data.vnp_SecureHash}`,
        }),
      });

      const result = await response1.json();

      console.log(result);
    } catch (error) {
      console.error("Error fetching refund data:");
    }
  };

  return (
    <>
      <Navbar />

      <div className="payment-page">
        <div className="more-data">
          <div
            style={{ display: shippingDisplay }}
            className="shipping-data animate"
          >
            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}
            <div key={order?.orderId} className="nav-link2">
              <div className="order1">
                <img src={order?.productImg} className="order-img1" />
                <div className="order-text1">
                  <p className="order-head">{order?.productName}</p>
                  <p className="order-category">{order?.productCategory}</p>
                  <p className="order-quantity">
                    Quantity: <b>{order?.quantity}</b>
                  </p>
                  <p className="order-total-price">
                    Total Price: <b>{order?.totalPrice.toLocaleString()} VND</b>
                  </p>
                  {order?.size && (
                    <p className="order-size">
                      Size: <b>{order.size}</b>
                    </p>
                  )}
                  {order?.color && (
                    <p className="order-color">
                      Color: <b>{order.color}</b>
                    </p>
                  )}
                  <div className="order-success">
                    <img
                      src={require("../imgs/order-done.png")}
                      className="order-done"
                    />
                    <p
                      style={{
                        marginLeft: "5px",
                        marginTop: 0,
                        marginBottom: 0,
                      }}
                      className="order-dispatch"
                    >
                      Ordered successfully! Preparing for dispatch!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="user-data-form">
              <div className="shipping-head">Edit Shipping details</div>

              <div className="all-data-of-user">
                <div className="user-data1">
                  <div className="country">
                    <p className="country-name">Country*</p>
                    <input
                      type="text"
                      placeholder="India"
                      onChange={handleCountry}
                      value={Country}
                      disabled={isDisabled}
                      required
                    />
                    {CountryError && (
                      <div className="error-message">{CountryError}</div>
                    )}
                  </div>
                  <div className="user-name">
                    <p className="user-fullname">Name*</p>
                    <input
                      type="text"
                      placeholder="Full name"
                      onChange={handleName}
                      value={Name}
                      disabled={isDisabled}
                      required
                    />
                    {NameError && (
                      <div className="error-message">{NameError}</div>
                    )}
                  </div>
                  <div className="user-contact">
                    <p className="user-number">Contact Number*</p>
                    <input
                      type="number"
                      placeholder="Number"
                      onChange={handleNumber}
                      value={Number}
                      disabled={isDisabled}
                      required
                    />
                    {NumberError && (
                      <div className="error-message">{NumberError}</div>
                    )}
                  </div>
                </div>
                <div className="user-data2">
                  <div className="user-email">
                    <p className="user-fullname">Email address*</p>
                    <input
                      type="text"
                      placeholder="Email"
                      onChange={handleEmail}
                      value={Email}
                      disabled={isDisabled}
                      required
                    />
                    {emailError && (
                      <div className="error-message">{emailError}</div>
                    )}
                  </div>
                  <div className="user-address">
                    <p className="user-fulladdress">Home Address*</p>
                    <input
                      type="text"
                      placeholder="Address"
                      onChange={handleAddress}
                      value={Address}
                      disabled={isDisabled}
                      required
                    />
                    {AddressError && (
                      <div className="error-message">{AddressError}</div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={() => {
                    if (
                      Name.length !== 0 &&
                      Address.length !== 0 &&
                      Country.length !== 0 &&
                      Number.length !== 0 &&
                      Email.length !== 0 &&
                      !NameError &&
                      !AddressError &&
                      !CountryError &&
                      !NumberError &&
                      !emailError
                    ) {
                      saveShippingDetails();
                    } else {
                      notify1();
                    }
                  }}
                  className="save-address"
                >
                  Save
                </button>
                <button className="cancel-order" onClick={cancelOrder}>
                  Cancel order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
