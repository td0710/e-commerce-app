import { useEffect, useState } from "react";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import OrderModel from "../models/OrderModel";
import axios, { AxiosError } from "axios";
import "./orders.css";
import { Pagination } from "../utils/Pagination";
import Spinner from "../utils/Spinner";
import { AdminProductPage } from "../ProductPage/AdminProduct";
import Swal from "sweetalert2";
export const AdminOrdersPage = () => {
  const [orderItems, setOrderItems] = useState<OrderModel[]>([]);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [orderPerPage] = useState(15);
  const [totalAmountOfOrders, setTotalAmountOfOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, isLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const handleOrderStatusChange = async (orderId: number, status: string) => {
    try {
      if (status === "DELIVERED") {
        const result = await Swal.fire({
          title: "Have you checked carefully?",
          text: "Please ensure all details are verified before marking this order as delivered.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, mark as delivered",
          cancelButtonText: "No, let me double-check",
        });

        if (!result.isConfirmed) {
          return; // Thoát nếu admin không xác nhận
        }
      }

      const url = `http://localhost:8080/api/orders/secure/admin/update/status/${orderId}?status=${status}`;
      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrderItems((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        )
      );

      Swal.fire({
        toast: true,
        text:
          status === "DELIVERED"
            ? "Order marked as delivered!"
            : "Status updated successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });
    } catch (e: any) {
      console.error("Error updating order status:", e);
      Swal.fire({
        toast: true,
        text: "Failed to update status. Please try again.",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: "top",
      });
    }
  };

  const fetchOrder = async () => {
    try {
      const url = `http://localhost:8080/api/orders/secure/admin/getall?page=${
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

      console.log(response);
      setOrderItems(loadedOrders);
      setTotalPages(response.data.totalPages);
      window.scrollTo(0, 0);
      isLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching orders:", axiosError);

      if (axiosError.response && axiosError.response.data) {
        const errorMessage =
          (axiosError.response.data as any).message || "Unknown error occurred";
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("Failed to load orders. Please try again.");
      }

      isLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [currentPage]);
  useEffect(() => {
    fetchOrder();
  }, []);
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
                  <div>
                    <div className="order" style={{ width: "1000px" }}>
                      <img
                        src={order.productImg}
                        className="order-img"
                        style={{ width: "100px", height: "100px" }}
                      />
                      <div className="order-text" style={{ width: "500px" }}>
                        <p className="order-head">
                          {order.productName.length > 20
                            ? order.productName.substring(0, 20) + "..."
                            : order.productName}
                        </p>
                        <p className="order-category">
                          {order.productCategory}
                        </p>
                        <p className="order-quantity">
                          Quantity: <b>{order.quantity}</b>, Total Price:{" "}
                          <b>{order.totalPrice.toLocaleString()} VND</b>, Size:{" "}
                          <b>{order.size}</b>, Color: <b>{order.color}</b>
                        </p>
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
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100px",
                          width: "500px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            height: "150px",
                            width: "200px",
                          }}
                        >
                          <b>Payment Status:</b>
                          <span
                            style={{
                              padding: "5px 10px",
                              borderRadius: "10px",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              backgroundColor:
                                order.paymentStatus === "PAID"
                                  ? "green"
                                  : order.paymentStatus === "REFUNDED"
                                  ? "red"
                                  : "gray",
                            }}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            height: "150px",
                            width: "200px",
                          }}
                        >
                          <p>
                            <b>Order Status:</b>
                          </p>
                          {
                            <select
                              className="styled-select"
                              value={order.status}
                              onChange={(e) =>
                                handleOrderStatusChange(
                                  order.orderId,

                                  e.target.value
                                )
                              }
                              disabled={
                                order.status === "CANCELLED" ||
                                order.status === "DELIVERED"
                              }
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option
                                value="CANCELLED"
                                disabled={order.status !== "CANCELLED"}
                              >
                                CANCELLED
                              </option>{" "}
                            </select>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
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

export default AdminOrdersPage;
