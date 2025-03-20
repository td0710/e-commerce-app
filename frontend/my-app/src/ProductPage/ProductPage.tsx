import React, { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { Link, useParams } from "react-router-dom";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import axios, { AxiosError } from "axios";
import "./productpage.css";
import { useAuth } from "../Context/useAuth";
import Swal from "sweetalert2";
export const ProductPage = () => {
  const [product, setProduct] = useState<ProductModel | null>(null);

  const { updateCartCount } = useAuth();

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [color, setColor] = useState("none");
  const [size, setSize] = useState("none");

  const { id } = useParams();

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  window.scrollTo(0, 0);

  const fetchProduct = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/products/${id}`;
      const url1 = `${process.env.REACT_APP_API_URL}/api/products/${id}/variants`;

      const [response, response1] = await Promise.all([
        axios.get(url),
        axios.get(url1),
      ]);

      const product = new ProductModel(
        response.data.id,
        response.data.title,
        response.data.description,
        response.data.category,
        response.data.price,
        response.data.image
      );

      product.variants = response1.data._embedded?.productVariants || [];

      setProduct(product);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching orders:", axiosError);

      if (axiosError.response && axiosError.response.data) {
        const errorMessage =
          (axiosError.response.data as any).message || "Unknown error occurred";
        setErrorMessage(errorMessage);
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const addToCart = async () => {
    if (!product || !size || !color) {
      alert("Please select size and color before adding to cart.");
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/api/carts/secure/add/cart/${userId}/${product?.id}?size=${size}&color=${color}`;

    try {
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
      fetchProduct();
      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Add to cart success",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "An unexpected error occurred!";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        errorMessage =
          axiosError.response?.data?.message || "Invalid username or password!";
      }

      if (axiosError.response) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: `${errorMessage}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const sizeOrder = ["S", "M", "L", "XL", "XXL"];

  const colors = useMemo(() => {
    return Array.from(
      new Set(
        product?.variants.filter((v) => v.color !== "none").map((v) => v.color)
      )
    );
  }, [product?.variants]);

  const sortedSizes = useMemo(() => {
    return Array.from(
      new Set(
        product?.variants.filter((v) => v.color === color).map((v) => v.size)
      )
    ).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  }, [product?.variants, color]);

  const showColorSelection = colors.length > 0;
  const showSizeSelection = sortedSizes.length > 0;
  return (
    <>
      <Navbar />
      <div
        style={product ? { height: "100%" } : { height: "100vh" }}
        className="product-page"
      >
        <div className={product ? `product-dataa animate` : `product-dataa`}>
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
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
              <div className="item-rating"></div>
            </div>
            {showColorSelection && (
              <div style={{ display: "block" }} className="cloth-size">
                <p className="choose">Choose a color</p>
                <div className="options">
                  {colors.map((c, index) => (
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

            {product && <hr className="horizontal" />}

            {showSizeSelection && sortedSizes[0] !== "none" && (
              <div style={{ display: "block" }} className="cloth-size">
                <p className="choose">Choose a size</p>
                <div className="options">
                  {sortedSizes.map((s, index) => (
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
              <button className="add-cart-btn" onClick={addToCart}>
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
