import { useEffect, useState } from "react";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import OrderModel from "../models/OrderModel";
import { NavLink } from "react-router-dom";
import axios, { AxiosError } from "axios";
import "./orders.css";
import { Pagination } from "../utils/Pagination";
import Spinner from "../utils/Spinner";
export const Orders = () => {
  const [orderItems, setOrderItems] = useState<OrderModel[]>([]);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [orderPerPage] = useState(5);
  const [totalAmountOfOrders, setTotalAmountOfOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, isLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const url = `${
          process.env.REACT_APP_API_URL
        }/api/orders/secure/getall?userId=${userId}&page=${
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
          paymentStatus: item.paymentStatus,
        }));

        setOrderItems(loadedOrders);
        setTotalPages(response.data.totalPages);
        window.scrollTo(0, 0);
        isLoading(false);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching orders:", axiosError);

        if (axiosError.response && axiosError.response.data) {
          const errorMessage =
            (axiosError.response.data as any).message ||
            "Unknown error occurred";
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage("Failed to load orders. Please try again.");
        }

        isLoading(false);
      }
    };

    fetchOrder();
  }, [currentPage]);

  const paginate = (pageNumer: number) => setCurrentPage(pageNumer);
  return (
    <>
      <Navbar />
      <div className="orders-section">
        {loading && <Spinner />}
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
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
          <div
            style={
              orderItems.length === 0
                ? { display: "block" }
                : { display: "none" }
            }
            className="order-now-section"
          >
            {!loading && !errorMessage && (
              <div className="empty-order">
                <img
                  src={require("../imgs/order-now.png")}
                  className="no-orders"
                />
                <div className="no-orders-txt"></div>
              </div>
            )}
          </div>
          <div className="all-orders">
            {orderItems &&
              orderItems.map((order) => {
                return (
                  <NavLink
                    to={`/edit-order/${order.orderId}`}
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

                        <p
                          className={`order-status ${
                            order?.status === "PENDING"
                              ? "order-pending"
                              : order?.status === "CONFIRMED"
                              ? "order-confirmed"
                              : order?.status === "SHIPPED"
                              ? "order-shipped"
                              : order?.status === "DELIVERED"
                              ? "order-delivered"
                              : order?.status === "CANCELLED" &&
                                order.paymentStatus === "REFUNDED"
                              ? "order-refund"
                              : "order-cancel"
                          }`}
                        >
                          {order?.status === "PENDING" &&
                            "⏳ Your order is pending confirmation."}
                          {order?.status === "CONFIRMED" &&
                            "✅ Your order has been confirmed! If you wish to cancel, please do so within 24 hours, as cancellation is not possible once shipping begins."}
                          {order?.status === "SHIPPED" &&
                            "🚚 Your order has been shipped! Please wait for it to arrive soon."}
                          {order?.status === "DELIVERED" &&
                            "📬 Your order has been delivered successfully! Thank you for shopping with us."}
                          {order?.status === "CANCELLED" &&
                            (order.paymentStatus === "REFUNDED"
                              ? "💰 Your order has been canceled. The refund is being processed. Please wait for the money to be returned to your account!"
                              : "❌ Your order has been canceled successfully.")}
                        </p>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            {orderItems.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "50px",
                }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  paginate={paginate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
