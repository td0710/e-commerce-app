import swal from "sweetalert";
import "../asserts/css/navbar.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import ProductModel from "../models/ProductModel";
import api from "../configuration/axiosconf";
export const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { wishlistCount, orderCount, cartCount } = useAuth();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const searchResultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchText.length < 1) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await api.get(
          `${process.env.REACT_APP_API_URL}/api/products/secure/search?query=${searchText}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSearchResults(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchText, token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (
        searchResultsRef.current &&
        target &&
        !searchResultsRef.current.contains(target) &&
        !document.querySelector(".search-bar")?.contains(target)
      ) {
        setSearchText("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearchNavigation = () => {
    if (searchText) {
      navigate(`/search?query=${searchText}`);
    }
  };
  return (
    <>
      <div className="navbar">
        <div className="left-section">
          <img
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate({ pathname: "/homepage" });
                  }
                });
              } else {
                navigate({ pathname: "/homepage" });
              }
            }}
            src={require("../asserts/imgs/logo.png")}
            className="logo"
          />
          <img
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate({ pathname: "/homepage" });
                  }
                });
              } else {
                navigate({ pathname: "/homepage" });
              }
            }}
            src={require("../asserts/imgs/A-logo.png")}
            className="logo2"
          />

          <div className="search-bar">
            <input
              type="text"
              className="search-box"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className="right-section">
          <img
            onClick={() => {
              if (window.location.href.includes("/payment")) {
                swal({
                  title: "Are you sure?",
                  text: "Your transaction is still pending!",
                  icon: "warning",
                  buttons: ["Cancel", "Yes"],
                }).then((willNavigate) => {
                  if (willNavigate) {
                    navigate("/wishlists");
                  }
                });
              } else {
                navigate(role === "USER" ? "/chat" : "/admin/chat");
              }
            }}
            src={require("../asserts/imgs/chat.png")}
            className="wishlist"
            style={{ marginRight: "20px" }}
          />
          {role === "USER" && (
            <>
              <img
                onClick={() => {
                  if (window.location.href.includes("/payment")) {
                    swal({
                      title: "Are you sure?",
                      text: "Your transaction is still pending!",
                      icon: "warning",
                      buttons: ["Cancel", "Yes"],
                    }).then((willNavigate) => {
                      if (willNavigate) {
                        navigate("/wishlists");
                      }
                    });
                  } else {
                    navigate("/wishlists");
                  }
                }}
                src={require("../asserts/imgs/wishlist.png")}
                className="wishlist"
              />

              <p style={{ opacity: 1 }} className="list-count">
                {wishlistCount}
              </p>
            </>
          )}
          {role === "ADMIN" && (
            <img
              onClick={() => navigate("/admin/orders")}
              src={require("../asserts/imgs/delivery-truck.png")}
              className="orders"
              style={{ marginRight: "40px", marginLeft: "30px" }}
            />
          )}
          {role === "ADMIN" && (
            <img
              onClick={() => navigate("/admin/add/product")}
              src={require("../asserts/imgs/plus.png")}
              className="orders"
              style={{ marginRight: "60px" }}
            />
          )}
          {role === "USER" && (
            <>
              <img
                onClick={() => {
                  if (window.location.href.includes("/payment")) {
                    swal({
                      title: "Are you sure?",
                      text: "Your transaction is still pending!",
                      icon: "warning",
                      buttons: ["Cancel", "Yes"],
                    }).then((willNavigate) => {
                      if (willNavigate) {
                        navigate("/cart");
                      }
                    });
                  } else {
                    navigate("/cart");
                  }
                }}
                src={require("../asserts/imgs/cart.png")}
                className="cart"
              />

              <p style={{ opacity: 1 }} className="cart-count">
                {cartCount}
              </p>
            </>
          )}
          {role === "USER" && (
            <>
              <img
                onClick={() => {
                  if (window.location.href.includes("/payment")) {
                    swal({
                      title: "Are you sure?",
                      text: "Your transaction is still pending!",
                      icon: "warning",
                      buttons: ["Cancel", "Yes"],
                    }).then((willNavigate) => {
                      if (willNavigate) {
                        navigate("/order");
                      }
                    });
                  } else {
                    navigate("/order");
                  }
                }}
                src={require("../asserts/imgs/orders.png")}
                className="orders"
              />

              <p style={{ opacity: 1 }} className="order-count">
                {orderCount}
              </p>
            </>
          )}

          <button className="signout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {searchText && (
        <div ref={searchResultsRef} className="search-results show">
          {searchResults.length === 0 && (
            <div className="search-results2">No results found</div>
          )}
          {searchResults.map((product) => (
            <div
              onClick={() => {
                if (window.location.href.includes("/payment")) {
                  swal({
                    title: "Are you sure?",
                    text: "Your transaction is still pending!",
                    icon: "warning",
                    buttons: ["Cancel", "Yes"],
                  }).then((willNavigate) => {
                    if (willNavigate) navigate(`/product/${product.id}`);
                  });
                } else {
                  navigate(
                    role === "ADMIN"
                      ? `/admin/product/${product.id}`
                      : `/product/${product.id}`
                  );
                }
              }}
              className="search-results2"
              key={product.id}
            >
              <div className="product-img">
                <img src={product.image} className="product-image" />
              </div>
              <div className="product-data">
                <p className="product-title">
                  {product.title.length > 50
                    ? product.title.slice(0, 50) + "..."
                    : product.title}
                </p>
                <p className="product-desc">
                  {product.category.length > 50
                    ? product.category.slice(0, 50) + "..."
                    : product.category}
                </p>
                <p className="product-desc">
                  {product.description.length > 50
                    ? product.description.slice(0, 50) + "..."
                    : product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
