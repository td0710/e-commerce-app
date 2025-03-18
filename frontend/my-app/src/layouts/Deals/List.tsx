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
  const role = localStorage.getItem("role");

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

        <NavLink
          to={
            role === "ADMIN"
              ? `/admin/product/${props.product.id}`
              : `/product/${props.product.id}`
          }
          key={props.product.id}
        >
          <button className="view">View product</button>
        </NavLink>
      </div>
      <div className="card-data">
        <p className="card-title">
          {props.product.title.length >= 32
            ? props.product.title.slice(0, 20) + ".."
            : props.product.title}
        </p>
        <div className="category-rating">
          <p className="card-category">{props.product.category}</p>
          <div className="rating"></div>
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
