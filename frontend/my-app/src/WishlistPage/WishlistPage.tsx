import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import axios from "axios";
import "../layouts/Deals/lists.css";
import { List } from "../layouts/Deals/List";
import { WhishlistList } from "./WishlistList";

export const WishlistPage = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);

  document.title = "Wishlist section";
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `http://localhost:8080/api/wishlists/secure/${localStorage.getItem(
          "id"
        )}?page=0&size=20`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched data:", response);

        const loadedProducts = response.data.content.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
        }));

        console.log("Processed products:", loadedProducts);
        setProducts(loadedProducts);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching products:", error);
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
          <div
            style={
              products.length === 0 ? { display: "flex" } : { display: "none" }
            }
            className="empty-list"
          >
            <img src={require("../imgs/empty.png")} className="empty-img" />
            <div className="empty-text">
              <p className="empty-head">It's empty here!</p>
              <p className="empty-desc">
                "Don't let your wishlist collect dust. Add some items that bring
                joy to your life and watch as they become a reality with just a
                few clicks."
              </p>
              <Link to="/homepage">
                <button className="shopping">Go Shopping</button>
              </Link>
            </div>
          </div>
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
