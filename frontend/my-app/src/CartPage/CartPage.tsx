import React, { useState, useEffect } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCartModel from "../models/ProdcutCartModel";
import "./cart.css";
export const CartSection = () => {
  const navigate = useNavigate();

  const [CartItems, setCartItems] = useState<ProductCartModel[]>([]);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(5);
  const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
          className={CartItems ? `cart-head animate` : `cart-head`}
        >
          Your Cart
        </p>
        <div
          style={
            CartItems && CartItems.length === 0
              ? { height: "40vh" }
              : { height: "100%" }
          }
          className={CartItems ? `cart-section animate` : `cart-section`}
        >
          <div className="cart-details">
            <div
              style={
                CartItems && CartItems.length === 0
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
              {CartItems.map((item) => {
                return (
                  <div className="cart-data" key={item.id}>
                    <img
                      onClick={() => navigate(`/product/${item.id}`)}
                      src={item.image}
                      alt=""
                      className="cart-item-img"
                    />
                    <div className="cart-all-data">
                      <p className="cart-title">{item.title}</p>
                      <div className="cart-price">
                        <p className="cart-discount">
                          ${(item.price * item.quantity).toFixed(1)}
                        </p>
                        <p
                          style={
                            (item && item.category === "men's clothing") ||
                            item.category === "women's clothing"
                              ? { display: "block" }
                              : { display: "none" }
                          }
                          className="cart-size"
                        >
                          Size: {item.size ? item.size : "Not choosen"}
                        </p>
                        <p
                          style={
                            (item && item.category === "men's clothing") ||
                            item.category === "women's clothing"
                              ? { display: "block" }
                              : { display: "none" }
                          }
                          className="cart-size"
                        >
                          Color: {item.color ? item.color : "Not choosen"}
                        </p>
                      </div>
                      <div className="more-buttons">
                        <div className="quantity-section">
                          <button
                            // onClick={() => dispatch(IncreaseQuantity(item.id))}
                            className="increase"
                          >
                            +
                          </button>
                          <p className="total-items">{item.quantity}</p>
                          <button
                            // onClick={() => dispatch(DecreaseQuantity(item.id))}
                            className="decrease"
                            disabled={
                              item && item.quantity === 1 ? true : false
                            }
                          >
                            -
                          </button>
                        </div>
                        <div className="right-btns">
                          <div className="save-btn">
                            <img
                              //   onClick={() => {
                              //     if (!isAdded(item.id)) {
                              //       dispatch(AddToList(item));
                              //     } else {
                              //       dispatch(RemoveList(item.id));
                              //     }
                              //   }}
                              src={require("../imgs/save.png")}
                              className="save-img"
                            />
                            <p>Save</p>
                          </div>
                          <div className="delete-btn">
                            <img
                              //   onClick={() => dispatch(RemoveCart(item.id))}
                              src={require("../imgs/delete.png")}
                              className="delete-img"
                            />
                            <p>Delete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={
              CartItems && CartItems.length === 0
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
