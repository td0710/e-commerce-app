import swal from "sweetalert";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../Context/useAuth";
export const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
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
                    navigate({ pathname: "/home" });
                  }
                });
              } else {
                navigate({ pathname: "/home" });
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
                    navigate({ pathname: "/home" });
                  }
                });
              } else {
                navigate({ pathname: "/home" });
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
          <p
          // style={
          //   ListItems && ListItems.length > 0
          //     ? { opacity: 1 }
          //     : { opacity: 0 }
          // }
          // className="list-count"
          >
            {/* {ListItems.length} */}
          </p>

          <img src={require("../../imgs/cart.png")} className="cart" />

          <p
          // style={
          //   CartItems && CartItems.length > 0
          //     ? { opacity: 1 }
          //     : { opacity: 0 }
          // }
          // className="cart-count"
          >
            {/* {totalQuantity} */}
          </p>

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
                    navigate("/orders");
                  }
                });
              } else {
                navigate("/orders");
              }
            }}
            src={require("../../imgs/orders.png")}
            className="orders"
          />
          {/* <p
            style={
              OrderItems && OrderItems.length > 0
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            className="order-count"
          >
            {totalLength}
          </p> */}

          <img
            onClick={() => navigate("/account")}
            src={require("../../imgs/default.png")}
            className="default"
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

      {searchText !== "" && (
        <div
        //   ref={searchResultsRef}
        //   className={`search-results ${searchResults.length ? "show" : ""}`}
        >
          {/* {searchResults.length > 0 &&
            searchResults.map((product) => (
              <div
                onClick={() => {
                  if (window.location.href.includes("/payment")) {
                    swal({
                      title: "Are you sure?",
                      text: "Your transaction is still pending!",
                      icon: "warning",
                      buttons: ["Cancel", "Yes"],
                    }).then((willNavigate) => {
                      if (willNavigate) {
                        navigate(`/product/${product.id}`);
                      }
                    });
                  } else {
                    navigate(`/product/${product.id}`);
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
                    {product.description.length > 50
                      ? product.description.slice(0, 50) + "..."
                      : product.description}
                  </p>
                </div>
              </div>
            ))} */}
        </div>
      )}
    </>
  );
};
