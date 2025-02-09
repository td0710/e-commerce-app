import React, { useState, useEffect } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCartModel from "../models/ProductCartModel";
import "./cart.css";
import { useAuth } from "../Context/useAuth";
import { CartItems } from "./CartItems";
export const CartSection = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<ProductCartModel[]>([]);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(5);
  const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  useEffect(() => {
    const fetchCart = async () => {
      const url = `http://localhost:8080/api/carts/secure/get/cart/${userId}?page=0&size=50`;
      console.log(userId);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      const loadedProducts = response.data.products.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      setCartItems(loadedProducts);
      setTotalPages(response.data.totalPages);
    };
    fetchCart();
  }, []);

  const paginate = (pageNumer: number) => setCurrentPage(pageNumer);

  return (
    <>
      <Navbar />

      <div className="entire-section">
        <p
          style={{ margin: 0 }}
          className={cartItems ? `cart-head animate` : `cart-head`}
        >
          Your Cart
        </p>
        <div
          style={
            cartItems && cartItems.length === 0
              ? { height: "40vh" }
              : { height: "100%" }
          }
          className={cartItems ? `cart-section animate` : `cart-section`}
        >
          <div className="cart-details">
            <div
              style={
                cartItems && cartItems.length === 0
                  ? { display: "block" }
                  : { display: "none" }
              }
              className="empty-cart"
            >
              <img
                src={require("../imgs/empty.png")}
                className="empty-cart-img"
              />
            </div>
            <div className="cart-item">
              {cartItems.map((item) => {
                return (
                  <CartItems
                    key={item.id}
                    cartItem={item}
                    onDelete={handleDeleteItem}
                  />
                );
              })}
            </div>
          </div>
          <div
            style={
              cartItems && cartItems.length === 0
                ? { display: "none" }
                : { display: "block" }
            }
            className="checkout-section"
          >
            <div className="congrats">
              <p>
                Congrats! You're eligible for <b>Free Delivery</b>.
                <p style={{ marginTop: "5px", marginBottom: "0px" }}>
                  Use code <b>SHUBHO20</b> for 20% discount.
                </p>
              </p>
            </div>
            <hr className="horizontal" />
            <div className="promocode">
              <input
                type="text"
                placeholder="Promocode"
                // onChange={handlePromocode}
                // value={promocode}
              />
              <button
                // onClick={() => {
                //   if (promocode === "SHUBHO20") {
                //     TotalValue(totalPrice1);
                //     setdiscountCode(promocode);
                //     setCorrectCode(true);
                //   } else if (promocode !== "SHUBHO20") {
                //     setdiscountCode(promocode);
                //     TotalValue(totalPrice2);
                //     setCorrectCode(false);
                //   }
                // }}
                className="promocode-btn"
              >
                Apply
              </button>
            </div>
            <p
              style={
                // CorrectCode === true
                //   ? { display: "block" }
                //   :
                { display: "none" }
              }
              className="applied"
            >
              <b>SHUBHO20</b> has been applied!
            </p>
            <p
              style={
                // CorrectCode === false && discountCode !== ""
                //   ?
                { display: "block" }
                //   :
                //   { display: "none" }
              }
              className="applied2"
            >
              Enter a valid promocode.
            </p>
            <hr className="horizontal" />

            <div className="money-data">
              <div className="money-1">
                <p className="total">Sub-Total</p>
                <p className="total-price">50000</p>
              </div>
              <div
                style={
                  //   CorrectCode === true
                  //     ? { display: "flex" }

                  //     :
                  { display: "none" }
                }
                className="money-2"
              >
                <p className="item-discount">Discount</p>
                <p className="item-discount2">(20%) </p>
              </div>
              <div className="money-3">
                <p className="item-delivery">Delivery</p>
                <p className="item-delivery2">$0.00</p>
              </div>
              <div className="money-4">
                <p className="item-tax">Tax</p>
                <p className="item-tax2">(5%)</p>
              </div>
            </div>
            <hr className="horizontal" />
            <div className="money-5">
              <p className="total">Total</p>
              <p
                style={
                  //   CorrectCode === true
                  //     ? { display: "block" }
                  //     :
                  { display: "none" }
                }
                className="total-price"
              >
                {/* ${totalPrice1} */} 500
              </p>
              <p
                style={
                  //   CorrectCode !== true?
                  { display: "block" }
                  // :
                  // { display: "none" }
                }
                className="total-price2"
              >
                {/* ${totalPrice2} */}
              </p>
            </div>
            <div className="payment-btn">
              <button
                // onClick={() => {
                //   navigate("/payment");
                //   if (CorrectCode === true) {
                //     TotalValue(totalPrice1);
                //   } else {
                //     TotalValue(totalPrice2);
                //   }
                // }}
                className="payment"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartSection;
