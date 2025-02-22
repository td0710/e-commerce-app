import React, { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { Link, useParams } from "react-router-dom";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import axios from "axios";
import "./productpage.css";
import { useAuth } from "../Context/useAuth";
export const ProductPage = () => {
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [variants, setVariants] = useState([]);

  const { updateCartCount } = useAuth();

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [color, setColor] = useState("none");
  const [size, setSize] = useState("none");
  const [choose, setChoose] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const url = `http://localhost:8080/api/products/${id}`;

      const response = await axios.get(url);
      const products = new ProductModel(
        response.data.id,
        response.data.title,
        response.data.description,
        response.data.category,
        response.data.price,
        response.data.image
      );

      window.scrollTo(0, 0);

      const url1 = `http://localhost:8080/api/products/${id}/variants`;

      const response1 = await axios.get(url1);
      const fetchedVariants = response1.data._embedded?.productVariants || [];

      const variants = response1.data._embedded?.productVariants || [];

      products.variants = variants;
      setProduct(products);
    };
    fetchProduct();
  }, [token]);
  const addToCart = async () => {
    if (!product || !size || !color) {
      alert("Please select size and color before adding to cart.");
      return;
    }
    console.log(product);

    const url = `http://localhost:8080/api/carts/secure/add/cart/${userId}/${product?.id}?size=${size}&color=${color}`;
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    updateCartCount();
    console.log(response);
  };
  const sizeOrder = ["S", "M", "L", "XL", "XXL"];

  const sortedSizes = useMemo(() => {
    return Array.from(
      new Set(
        product?.variants.filter((v) => v.color === color).map((v) => v.size)
      )
    ).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  }, [product?.variants, color]);
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
            {Array.isArray(product?.variants) &&
              product?.variants.some((v) => v.color !== "none") && (
                <div style={{ display: "block" }} className="cloth-size">
                  <p className="choose">Choose a color</p>
                  <div className="options">
                    {Array.from(
                      new Set(product?.variants.map((v) => v.color))
                    ).map((c, index) => (
                      <p
                        key={index}
                        className={`size ${color === c ? `size-clicked` : ""}`}
                        onClick={() => setColor(c)}
                      >
                        {c}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            {product ? <hr className="horizontal" /> : ""}

            {color &&
              product?.variants?.some(
                (v) =>
                  v.color !== "none" &&
                  v.color === color &&
                  v.size !== null &&
                  v.size !== "none"
              ) && (
                <div style={{ display: "block" }} className="cloth-size">
                  <p className="choose">Choose a size</p>
                  <div className="options">
                    {color &&
                      sortedSizes.map((s, index) => (
                        <p
                          key={index}
                          className={`size ${size === s ? "size-clicked" : ""}`}
                          onClick={() => setSize(s)}
                        >
                          {s}
                        </p>
                      ))}
                  </div>
                </div>
              )}

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
                <button className="buy-btn">Buy Now</button>
              </Link>
              <button className="add-cart-btn">
                <img
                  src={require("../imgs/not-added.png")}
                  className="cart-img"
                />
                <p
                  onClick={addToCart}
                  style={{ marginLeft: "8px" }}
                  className="cart-text"
                >
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
