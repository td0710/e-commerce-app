import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import axios from "axios";
import "../layouts/Deals/lists.css";

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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
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
                  <div className="card" key={items.id}>
                    <div className="card-img-data">
                      <img src={items.image} className="card-img" />
                      <img
                        // onClick={() => {
                        //   if (!isAdded(items.id)) {
                        //     dispatch(AddToList(items));
                        //   } else {
                        //     dispatch(RemoveList(items.id));
                        //   }
                        // }}
                        // src={isAdded(items.id) ? Added : Add}
                        className="add-list2"
                      />
                      <NavLink to={`/product/${items.id}`} key={items.id}>
                        <button className="view">View product</button>
                      </NavLink>
                    </div>
                    <div className="card-data">
                      <p className="card-title">
                        {items.title.length >= 32
                          ? items.title.slice(0, 32) + ".."
                          : items.title}
                      </p>
                      <div className="category-rating">
                        <p className="card-category">{items.category}</p>
                        <div className="rating">
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
                          <p className="rating-text">5</p>
                        </div>
                      </div>
                      <div className="card-price">
                        <p className="discount">${items.price}</p>
                        <p className="mrp">${Math.round(items.price * 1.66)}</p>
                        <p className="price-off">(60% OFF)</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
