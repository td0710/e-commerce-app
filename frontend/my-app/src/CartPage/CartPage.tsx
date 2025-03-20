import { useState, useEffect } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
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
  const [code, setCode] = useState("");
  const [codeDiscount, setCodeDiscount] = useState("");

  const [discountValue, setDiscountValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const {
    cartCount,
    wishlistCount,
    updateCartCount,
    updateOrderCount,
    updateWishlistCount,
  } = useAuth();

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(2);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, isLoading] = useState(true);

  const handlePayment = () => {
    let total1;
    if (selectedItemDetails !== null) {
      total1 = (
        selectedItemDetails.price * selectedItemDetails.quantity +
        selectedItemDetails.price * selectedItemDetails.quantity * 0.05 -
        selectedItemDetails.price *
          selectedItemDetails.quantity *
          (discountValue / 100)
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
    setIsDiscountApplied(false);
    setDiscountValue(0);
    setCode("");
    setErrorMessage("");
    setCodeDiscount("");
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
      try {
        setError("");
        const url = `${
          process.env.REACT_APP_API_URL
        }/api/carts/secure/get/cart/${userId}?page=${
          currentPage - 1
        }&size=${productPerPage}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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
        setTotalPages(response.data.totalPages);
        updateCartCount();
        updateOrderCount();
        updateWishlistCount();
      } catch (error) {
        console.error("Error fetching cart:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Could not fetch cart!");
        } else {
          setError("Unexpected error!");
        }
      } finally {
        isLoading(false);
      }
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

  const applyDiscount = async (
    code: string,
    productId: number,
    category: string
  ) => {
    try {
      if (!category) {
        setErrorMessage("Category is required to apply a discount.");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/api/discounts/secure/get?code=${code}&productId=${productId}&category=${category}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setDiscountValue(response.data.value);
      setIsDiscountApplied(true);
      setCodeDiscount(response.data.code);
      setErrorMessage("");
    } catch (error) {
      setCodeDiscount("");
      setIsDiscountApplied(false);
      setDiscountValue(0);
      const axiosError = error as AxiosError;
      console.error("Full error:", axiosError);

      if (axiosError.response) {
        const errorData = axiosError.response.data as {
          code: number;
          message: string;
        };
        if (errorData && errorData.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage(`Server error: ${axiosError.response.status}`);
        }
      } else if (axiosError.request) {
        setErrorMessage("Network error: Could not connect to the server.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  const paginate = (pageNumer: number) => setCurrentPage(pageNumer);
  return (
    <>
      <Navbar />

      <div className="entire-section">
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

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
            {!isDiscountApplied && !errorMessage && (
              <div className="congrats">
                <p style={{ color: "green" }}>
                  Enter valid code to get discount
                </p>
              </div>
            )}
            {isDiscountApplied && !errorMessage && (
              <div className="congrats">
                <p style={{ color: "green" }}>
                  Code <b>{codeDiscount}</b> applied! ({discountValue}% off)
                </p>
              </div>
            )}{" "}
            {errorMessage && (
              <div className="failed">
                <p>{errorMessage}</p>
              </div>
            )}
            <hr className="horizontal" />
            <div className="promocode">
              <input
                type="text"
                placeholder="Promocode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                className="promocode-btn"
                onClick={() =>
                  selectedItemDetails &&
                  applyDiscount(
                    code,
                    selectedItemDetails.productId,
                    selectedItemDetails.category
                  )
                }
              >
                Apply
              </button>
            </div>
            <p style={{ display: "none" }} className="applied"></p>
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

              <div className="money-4">
                <p className="item-tax">Discount</p>
                <p className="item-tax2">
                  ({discountValue}%) - $
                  {selectedItemDetails
                    ? (
                        selectedItemDetails.price *
                        selectedItemDetails.quantity *
                        (discountValue / 100)
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
                $
                {selectedItemDetails
                  ? (
                      selectedItemDetails.price * selectedItemDetails.quantity +
                      selectedItemDetails.price *
                        selectedItemDetails.quantity *
                        0.05 -
                      (isDiscountApplied
                        ? (selectedItemDetails.price *
                            selectedItemDetails.quantity *
                            discountValue) /
                          100
                        : 0)
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="payment-btn">
              <button
                className="payment"
                onClick={() => selectedItemDetails && handlePayment()}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
        {cartCount > 0 && cartItems.length > 0 && (
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
