import axios from "axios";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import "../PaymentPage/payment.css";

export const EditOrderPage = () => {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

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
    const response = await axios.put(url, shippingDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
  useEffect(() => {
    const fetchShippingDetails = async () => {
      const url = `http://localhost:8080/api/orders/secure/get/${orderId}`;

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
  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="more-data">
          <div
            style={{ display: shippingDisplay }}
            className="shipping-data animate"
          >
            <div className="shipping-head">Edit Shipping details</div>
            <div className="user-data-form">
              <p className="order-id">Order ID: {orderId}</p>
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
                    saveShippingDetails();
                  } else {
                    notify1();
                  }
                }}
                className="save-address"
              >
                Save
              </button>
              <button className="cancel-order">Cancel Order</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
