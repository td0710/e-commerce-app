import { useEffect, useState } from "react";
import ProductModel from "../../models/ProductModel";
import "./lists.css";
import "./deals.css";
import axios from "axios";
import { useAuth } from "../../Context/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
export const List: React.FC<{
  product: ProductModel;
}> = (props) => {
  const [add, setAdd] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const { updateWishlistCount } = useAuth();
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !token) return;
      try {
        const url = `http://localhost:8080/api/wishlists/secure/check/${userId}?productId=${props.product.id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log(response.data);

        setAdd(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    checkWishlist();
  }, [props.product.id, userId, token]);

  const addControll = async () => {
    if (add) {
      const url = `http://localhost:8080/api/wishlists/secure/delete/${userId}?productId=${props.product.id}`;
      const data = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAdd(false);
    } else {
      console.log(localStorage.getItem("token"));
      const url = `http://localhost:8080/api/wishlists/secure/add/${userId}?productId=${props.product.id}`;
      const data = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAdd(true);
    }
    updateWishlistCount();
  };
  return (
    <div className="card" key={props.product.id}>
      <div className="card-img-data">
        <img src={props.product.image} className="card-img" />
        <img
          onClick={() => addControll()}
          src={
            add
              ? require("../../imgs/red-heart.png")
              : require("../../imgs/heart.png")
          }
          className="add-list"
        />

        <NavLink to={`/product/${props.product.id}`} key={props.product.id}>
          <button className="view">View product</button>
        </NavLink>
      </div>
      <div className="card-data">
        <p className="card-title">
          {props.product.title.length >= 32
            ? props.product.title.slice(0, 32) + ".."
            : props.product.title}
        </p>
        <div className="category-rating">
          <p className="card-category">{props.product.category}</p>
          <div className="rating">
            <img
              src={require("../../imgs/rating.png")}
              className="rating-img"
            />
            <img
              src={require("../../imgs/rating.png")}
              className="rating-img"
            />
            <img
              src={require("../../imgs/rating.png")}
              className="rating-img"
            />
            <img
              src={require("../../imgs/rating.png")}
              className="rating-img"
            />
            <img
              src={require("../../imgs/rating.png")}
              className="rating-img"
            />
            <p className="rating-text">
              {/* {"5 " + "(" + props.product.reviewNumber + " reviews)"} */}
            </p>
          </div>
        </div>
        <div className="card-price">
          <p className="discount">${props.product.price}</p>
          <p className="mrp">${Math.round(props.product.price * 1.66)}</p>
          <p className="price-off">(60% OFF)</p>
        </div>
      </div>
    </div>
  );
};
