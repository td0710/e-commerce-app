import React, { useState, useEffect } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCartModel from "../models/ProductCartModel";
import "./cart.css";
import { useAuth } from "../Context/useAuth";
import { CartItems } from "./CartItems";
import { Pagination } from "../utils/Pagination";
import Spinner from "../utils/Spinner";
export const CartSection = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<ProductCartModel[]>([]);
  const [total, setTotal] = useState(0);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const { cartCount, wishlistCount, updateCartCount } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(2);
  const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, isLoading] = useState(true);

  const handlePayment = () => {
    let total1;
    if (selectedItemDetails !== null) {
      total1 = (
        selectedItemDetails.price * selectedItemDetails.quantity +
        selectedItemDetails.price * selectedItemDetails.quantity * 0.05
      ).toFixed(2);
    }
    if (selectedItemDetails?.cartItemId != null) {
      localStorage.setItem(
        "currentItem",
        String(selectedItemDetails.cartItemId)
      );
    }

    navigate("/payment", {
      state: {
        totalPrice: total1,
        cartItems: selectedItemDetails?.cartItemId,
      },
    });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const [selectedItemDetails, setSelectedItemDetails] =
    useState<ProductCartModel | null>(null);

  const handleDeleteItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleSelectItem = async (id: number, quantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      setSelectedItemDetails(item);
    } else {
      setSelectedItemDetails(null);
    }
  };
  const handleSelectItemIn = async (id: number, quantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      item.quantity = quantity + 1;
    }
    if (item) {
      setSelectedItemDetails(item);
    } else {
      setSelectedItemDetails(null);
    }
  };
  const handleSelectItemDe = async (id: number, quantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      item.quantity = quantity - 1;
    }
    if (item) {
      setSelectedItemDetails(item);
    } else {
      setSelectedItemDetails(null);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      const url = `http://localhost:8080/api/carts/secure/get/cart/${userId}?page=${
        currentPage - 1
      }&size=${productPerPage}`;
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
        cartItemId: item.cartItemId,
        productId: item.productId,
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
      isLoading(false);
      setTotalPages(response.data.totalPages);
    };
    fetchCart();
  }, [cartCount, wishlistCount, currentPage]);
  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  }, [cartItems]);

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
        {loading && <Spinner />}
        <div
          style={
            cartItems && cartItems.length === 0
              ? { height: "40vh" }
              : { height: "100%" }
          }
          className={cartItems ? `cart-section animate` : `cart-section`}
        >
          <div className="cart-details">
            {!loading && (
              <div
                style={
                  cartItems && cartItems.length === 0
                    ? { display: "block" }
                    : { display: "none" }
                }
                className="empty-cart"
              >
                <img
                  src={require("../imgs/cart-empty.png")}
                  className="empty-cart-img"
                />
              </div>
            )}
            <div className="cart-item">
              {cartItems.map((item) => {
                return (
                  <CartItems
                    key={item.id}
                    cartItem={item}
                    onDelete={handleDeleteItem}
                    onSelect={() => handleSelectItem(item.id, item.quantity)}
                    onSelectIn={() =>
                      handleSelectItemIn(item.id, item.quantity)
                    }
                    onSelectDe={() =>
                      handleSelectItemDe(item.id, item.quantity)
                    }
                    isSelected={selectedItemDetails?.id === item.id}
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
              <input type="text" placeholder="Promocode" />
              <button className="promocode-btn">Apply</button>
            </div>
            <p style={{ display: "none" }} className="applied">
              <b>SHUBHO20</b> has been applied!
            </p>
            <p style={{ display: "block" }} className="applied2">
              Enter a valid promocode.
            </p>
            <hr className="horizontal" />

            <div className="money-data">
              <div className="money-1">
                <p className="total">Sub-Total</p>
                <p className="total-price">
                  $
                  {selectedItemDetails
                    ? (
                        selectedItemDetails.price * selectedItemDetails.quantity
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div style={{ display: "none" }} className="money-2">
                <p className="item-discount">Discount</p>
                <p className="item-discount2">(20%) </p>
              </div>
              <div className="money-3">
                <p className="item-delivery">Delivery</p>
                <p className="item-delivery2">$0.00</p>
              </div>
              <div className="money-4">
                <p className="item-tax">Tax</p>
                <p className="item-tax2">
                  (5%) + $
                  {selectedItemDetails
                    ? (
                        selectedItemDetails.price *
                        selectedItemDetails.quantity *
                        0.05
                      ).toFixed(2)
                    : 0}
                </p>
              </div>
            </div>
            <hr className="horizontal" />
            <div className="money-5">
              <p className="total">Total</p>
              <p style={{ display: "none" }} className="total-price"></p>
              <p style={{ display: "block" }} className="total-price2">
                $ $
                {selectedItemDetails
                  ? (
                      selectedItemDetails.price * selectedItemDetails.quantity +
                      selectedItemDetails.price *
                        selectedItemDetails.quantity *
                        0.05
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="payment-btn">
              <button className="payment" onClick={handlePayment}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
        {cartCount > 0 && (
          <div style={{ marginBottom: "100px" }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            ></Pagination>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartSection;
