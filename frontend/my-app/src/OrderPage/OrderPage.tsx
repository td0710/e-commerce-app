import { useEffect, useState } from "react";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import OrderModel from "../models/OrderModel";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./orders.css";
export const Orders = () => {
  const [orderItems, setOrderItems] = useState<OrderModel[]>([]);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [orderPerPage] = useState(15);
  const [totalAmountOfOrders, setTotalAmountOfOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const url = `http://localhost:8080/api/orders/secure/getall?userId=42&page=${
          currentPage - 1
        }&size=${orderPerPage}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const loadedOrders = response.data.orders.map((item: any) => ({
          orderId: item.orderId,
          totalPrice: item.totalPrice,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          shippingName: item.shippingName,
          shippingAddress: item.shippingAddress,
          shippingCountry: item.shippingCountry,
          shippingEmail: item.shippingEmail,
          productName: item.productName,
          productCategory: item.productCategory,
          productImg: item.productImg,
          status: item.status,
        }));

        setOrderItems(loadedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrder();
  }, [currentPage]);

  return (
    <>
      <Navbar />
      <div className="orders-section">
        <div
          style={
            orderItems.length === 0
              ? { textAlign: "center", height: "48vh" }
              : { textAlign: "unset", height: "fit-content" }
          }
          className={orderItems ? `ordered-data animate` : `ordered-data`}
        >
          <div
            style={
              orderItems.length !== 0
                ? { justifyContent: "space-between" }
                : { justifyContent: "center" }
            }
            className="head-texts"
          >
            <p
              style={
                orderItems.length === 0
                  ? { marginBottom: "0px" }
                  : { marginBottom: "16px" }
              }
              className="order-head-text"
            >
              Your Orders
            </p>
            <button
              style={
                orderItems.length !== 0
                  ? { display: "flex" }
                  : { display: "none" }
              }
              onClick={() => {
                localStorage.removeItem("orderItems");
                window.location.reload();
              }}
              className="delete-orders"
            >
              <img
                src={require("../imgs/delete-order.png")}
                className="delete-order-btn"
              />
              <p style={{ margin: 0 }}>Clear Data</p>
            </button>
          </div>
          <div
            style={
              orderItems.length === 0
                ? { display: "block" }
                : { display: "none" }
            }
            className="order-now-section"
          >
            <div className="empty-order">
              <img
                src={require("../imgs/order-now.png")}
                className="no-orders"
              />
              <div className="no-orders-txt"></div>
            </div>
          </div>
          <div className="all-orders">
            {orderItems &&
              orderItems
                .filter((order) => order.status === "CONFIRMED") // Lọc chỉ lấy đơn hàng đã xác nhận
                .map((order) => {
                  return (
                    <NavLink
                      to={`/product/${order.orderId}`}
                      key={order.orderId}
                      className="nav-link2"
                    >
                      <div className="order">
                        <img src={order.productImg} className="order-img" />
                        <div className="order-text">
                          <p className="order-head">{order.productName}</p>
                          <p className="order-category">
                            {order.productCategory}
                          </p>
                          <p className="order-quantity">
                            Quantity: <b>{order.quantity}</b>
                          </p>
                          <p className="order-total-price">
                            Total Price:{" "}
                            <b>{order.totalPrice.toLocaleString()} VND</b>
                          </p>
                          {order.size && (
                            <p className="order-size">
                              Size: <b>{order.size}</b>
                            </p>
                          )}
                          {order.color && (
                            <p className="order-color">
                              Color: <b>{order.color}</b>
                            </p>
                          )}
                          <p className="order-shipping">
                            Shipping to:{" "}
                            <b>
                              {order.shippingAddress}, {order.shippingCountry}
                            </b>
                          </p>
                          <p className="order-recipient">
                            Recipient: <b>{order.shippingName}</b> (
                            {order.shippingEmail})
                          </p>
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
                    </NavLink>
                  );
                })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
