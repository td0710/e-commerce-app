import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import axios, { AxiosError } from "axios";
import "../layouts/Deals/lists.css";
import { List } from "../layouts/Deals/List";
import { WhishlistList } from "./WishlistList";
import Spinner from "../utils/Spinner";
import api from "../configuration/axiosconf";
export const WishlistPage = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  document.title = "Wishlist section";
  document.title = "Wishlist section";

  document.title = "Wishlist section";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${
          process.env.REACT_APP_API_URL
        }/api/wishlists/secure/${localStorage.getItem("id")}?page=0&size=10`;
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const loadedProducts = response.data.content.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
        }));
        setLoading(false);
        setProducts(loadedProducts);
        window.scrollTo(0, 0);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching products:", axiosError);

        if (axiosError.response && axiosError.response.data) {
          const backendMessage =
            (axiosError.response.data as any).message || "Unknown error";
          setErrorMessage(backendMessage);
        } else {
          setErrorMessage(
            "Failed to load products. Please check your internet connection."
          );
        }

        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = (id: number) => {
    setProducts((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  return (
    <>
      <Navbar />
      <div style={{ height: "100%" }} className="content">
        <div className={products ? `lists animate` : `lists`}>
          <p className="wishlist-head">Wishlist</p>
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
          {loading && <Spinner />}
          {!loading && !errorMessage && (
            <div
              style={
                products.length === 0
                  ? { display: "flex" }
                  : { display: "none" }
              }
              className="empty-list"
            >
              <img src={require("../imgs/empty.png")} className="empty-img" />
              <div className="empty-text">
                <p className="empty-head">It's empty here!</p>
                <p className="empty-desc">
                  "Don't let your wishlist collect dust. Add some items that
                  bring joy to your life and watch as they become a reality with
                  just a few clicks."
                </p>
                <Link to="/homepage">
                  <button className="shopping">Go Shopping</button>
                </Link>
              </div>
            </div>
          )}
          <div className="lists-items">
            {products &&
              products.length > 0 &&
              products.map((items) => {
                return (
                  <WhishlistList
                    product={items}
                    key={items.id}
                    onDelete={handleDelete}
                  ></WhishlistList>
                );
              })}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
