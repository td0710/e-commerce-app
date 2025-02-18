import React, { ChangeEvent, useEffect, useState } from "react";
import "./payment.css";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import axios from "axios";

export const PaymentPage = () => {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

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

  const notify1 = () => alert("Vui lòng nhập đầy đủ thông tin!");
  useEffect(() => {
    const fetchShippingDetails = async () => {
      const url = `http://localhost:8080/api/shippingdetails/secure/get?id=${userId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setName(response.data.name);
      setAddress(response.data.homeAddress);
      setCountry(response.data.country);
      setNumber(response.data.contactNumber);
      setEmail(response.data.email);
    };
    fetchShippingDetails();
  }, []);

  const saveShippingDetails = async () => {
    const url = `http://localhost:8080/api/shippingdetails/secure/save?id=${userId}`;
    const shippingDetails = {
      userId: userId,
      country: Country,
      name: Name,
      contactNumber: Number,
      email: Email,
      homeAddress: Address,
    };
    const response = await axios.put(url, shippingDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="payment-page">
        <div className="more-data">
          <div
            style={{ display: shippingDisplay }}
            className="shipping-data animate"
          >
            <div className="shipping-head">Shipping details</div>
            <div className="user-data-form">
              <p className="order-id">Order ID: {OrderID}</p>
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
                    setDisabled(true);
                    setShippingDisplay("none");
                    setCardDisplay("block");
                    saveShippingDetails();
                  } else {
                    notify1();
                  }
                }}
                className="save-address"
              >
                Save
              </button>
            </div>
          </div>
          <div
            style={{ display: cardDisplay }}
            className="payment-data animate"
          >
            <div className="payment-option">
              <p className="payment-method">Choose your payment method</p>
              <div className="choose-option">
                <div className="cod">
                  <input
                    type="radio"
                    name="payment-method"
                    // onChange={handlePaymentChange}
                    value="COD"
                    // checked={paymentMode === "COD"}
                  />
                  Cash on Delivery (COD)
                </div>
                <div className="credit">
                  <input
                    type="radio"
                    name="payment-method"
                    // onChange={handlePaymentChange}
                    value="Credit"
                    // checked={paymentMode === "Credit"}
                  />
                  Credit/Debit Card
                </div>
              </div>
              <div className="total-amount">
                <p className="subtotal-amount">Total Amount :</p>
                <p className="main-amount">$100</p>
              </div>
              <div className="order-place-btn">
                <button className="confirm-btn">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
