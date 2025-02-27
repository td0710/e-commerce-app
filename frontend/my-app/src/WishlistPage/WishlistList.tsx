import { useEffect, useState } from "react";
import ProductModel from "../models/ProductModel";
import "../layouts/Deals/lists.css";
import "../layouts/Deals/deals.css";
import axios from "axios";
import { useAuth } from "../Context/useAuth";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
export const WhishlistList: React.FC<{
  product: ProductModel;
  onDelete: (id: number) => void;
}> = (props) => {
  const [add, setAdd] = useState(false);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const { updateWishlistCount } = useAuth();

  const deleteItem = async () => {
    try {
      const url = `http://localhost:8080/api/wishlists/secure/delete/${userId}?productId=${props.product.id}`;
      const data = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAdd(false);
      updateWishlistCount();
      props.onDelete(props.product.id);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message || "Could not delete item!",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="card" key={props.product.id}>
      <div className="card-img-data">
        <img src={props.product.image} className="card-img" />
        <img
          onClick={deleteItem}
          src={require("../imgs/red-heart.png")}
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
            <img src={require("../imgs/rating.png")} className="rating-img" />
            <img src={require("../imgs/rating.png")} className="rating-img" />
            <img src={require("../imgs/rating.png")} className="rating-img" />
            <img src={require("../imgs/rating.png")} className="rating-img" />
            <img src={require("../imgs/rating.png")} className="rating-img" />
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
