import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { Link, useParams } from "react-router-dom";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import axios from "axios";
import "./productpage.css";
export const ProductPage = () => {
  const [product, setProduct] = useState<ProductModel | null>(null);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchProduct = async () => {
      const url = `http://localhost:8080/api/products/${id}`;

      const response = await axios.get(url);
      console.log(response);
      const products = new ProductModel(
        response.data.id,
        response.data.title,
        response.data.description,
        response.data.category,
        response.data.price,
        response.data.image
      );
      setProduct(products);
      window.scrollTo(0, 0);
      console.log(products.description);
    };
    fetchProduct();
  }, []);
  return (
    <>
      <Navbar />
      <div
        style={product ? { height: "100%" } : { height: "100vh" }}
        className="product-page"
      >
        <div className={product ? `product-dataa animate` : `product-dataa`}>
          <div className="item-image">
            <img
              src={product?.image}
              className={`item-img ${product?.image ? "img-style" : ""}`}
            />
          </div>
          <div className="product-details">
            <p className="item-title">{product?.title}</p>
            <p className="item-desc">{product?.description}</p>
            <div className="price-section">
              <div className="item-rating">
                <img
                  src={require("../imgs/rating.png")}
                  className="rating-img"
                />
                <img
                  src={require("../imgs/rating.png")}
                  className="rating-img"
                />
                <img
                  src={require("../imgs/rating.png")}
                  className="rating-img"
                />
                <img
                  src={require("../imgs/rating.png")}
                  className="rating-img"
                />
                <img
                  src={require("../imgs/rating.png")}
                  className="rating-img"
                />
                <p className="rating-no">20</p>
              </div>
            </div>
            {product ? <hr className="horizontal" /> : ""}
            <div style={{ display: "block" }} className="cloth-size">
              <p className="choose">Choose a size</p>
              <div className="options">
                <p
                  //   onClick={() => setSize("S")}
                  className="size "
                >
                  S
                </p>
                <p
                  //   onClick={() => setSize("M")}
                  className="size "
                >
                  M
                </p>
                <p
                  //   onClick={() => setSize("L")}
                  className="size "
                >
                  L
                </p>
                <p
                  // onClick={() => setSize("XL")}
                  className="size"
                >
                  XL
                </p>
                <p
                  //   onClick={() => setSize("XXL")}
                  className="size "
                >
                  XXL
                </p>
              </div>
            </div>
            <div style={{ display: "block" }} className="cloth-size">
              <p className="choose">Choose a color</p>
              <div className="options">
                <p
                  //   onClick={() => setSize("S")}
                  className="size "
                >
                  Red
                </p>
                <p
                  //   onClick={() => setSize("M")}
                  className="size "
                >
                  Blue
                </p>
                <p
                  //   onClick={() => setSize("L")}
                  className="size "
                >
                  Yellow
                </p>
              </div>
            </div>
            {(product && product?.category === "men's clothing") ||
            product?.category === "women's clothing" ? (
              <hr className="horizontal" />
            ) : (
              ""
            )}
            {product ? (
              <div className="product-actual-price">
                <p className="price-one">Price:</p>
                <p className="price-two">${product?.price}</p>
                <p className="mrp">${Math.round(product?.price * 1.66)}</p>
              </div>
            ) : (
              ""
            )}

            <div
              style={product ? { display: "flex" } : { display: "none" }}
              className="buying-buttons"
            >
              <Link to="/cart">
                <button
                  // onClick={handleAddToCart2}
                  className="buy-btn"
                >
                  Buy Now
                </button>
              </Link>
              <button
                // onClick={() => {
                //   handleAddToCart();
                // }}
                className="add-cart-btn"
              >
                <img
                  src={require("../imgs/not-added.png")}
                  className="cart-img"
                />
                <p style={{ marginLeft: "8px" }} className="cart-text">
                  Add
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductPage;
