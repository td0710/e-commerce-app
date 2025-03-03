import swal from "sweetalert";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import axios from "axios";
import ProductModel from "../../models/ProductModel";
export const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { wishlistCount, orderCount, cartCount } = useAuth();

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const searchResultsRef = useRef<HTMLDivElement>(null); // Kiểu rõ ràng
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchText.length < 1) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/secure/search?query=${searchText}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSearchResults(response.data.slice(0, 5));
        console.log(response);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchText, token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null; // Kiểm tra instanceof
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
            src={require("../../imgs/logo.png")}
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
            src={require("../../imgs/A-logo.png")}
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
            <button className="search-btn">
              <img
                src={require("../../imgs/search.png")}
                className="search-img"
              />
            </button>
          </div>
        </div>
        <div className="right-section">
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
                src={require("../../imgs/wishlist.png")}
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
              src={require("../../imgs/delivery-truck.png")}
              className="orders"
              style={{ marginRight: "30px" }}
            />
          )}
          {role === "ADMIN" && (
            <img
              onClick={() => navigate("/admin/add/product")}
              src={require("../../imgs/plus.png")}
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
                src={require("../../imgs/cart.png")}
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
                src={require("../../imgs/orders.png")}
                className="orders"
              />

              <p style={{ opacity: 1 }} className="order-count">
                {orderCount}
              </p>
            </>
          )}
          <img
            onClick={() => navigate("/account")}
            src={require("../../imgs/default.png")}
            className="default"
            style={
              role === "ADMIN"
                ? { marginRight: "50px" }
                : { marginRight: "20px" }
            }
          />
          <button className="signout-btn" onClick={logout}>
            Log out
          </button>
        </div>

        <div className="search-bar2">
          <input
            type="text"
            className="search-box"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-btn">
            {/* <img src={search} className="search-img" /> */}
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
