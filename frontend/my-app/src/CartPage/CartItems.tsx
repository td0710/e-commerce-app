import ProductCartModel from "../models/ProductCartModel";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import axios from "axios";
import { useAuth } from "../Context/useAuth";
import { useState } from "react";
export const CartItems: React.FC<{
  cartItem: ProductCartModel;
  onDelete: (id: number) => void;
}> = (props) => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [quantity, setQuantity] = useState(props.cartItem.quantity);
  const { updateCartCount } = useAuth();
  const increaseItem = async () => {
    console.log(props.cartItem);

    const url = `http://localhost:8080/api/carts/secure/add/cart/${userId}/${props.cartItem.id}?size=${props.cartItem.size}&color=${props.cartItem.color}`;
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
    setQuantity((prev) => prev + 1);
    updateCartCount();
    console.log(response);
  };

  const decreaseItem = async () => {
    console.log(props.cartItem);

    const url = `http://localhost:8080/api/carts/secure/decrease/cart/${userId}/${props.cartItem.id}?size=${props.cartItem.size}&color=${props.cartItem.color}`;
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
    setQuantity((prev) => {
      const newQuantity = prev - 1;
      if (newQuantity === 0) {
        props.onDelete(props.cartItem.id);
      }
      return newQuantity;
    });
    updateCartCount();
    console.log(response);
  };
  const deleteItem = async () => {
    console.log(props.cartItem);

    const url = `http://localhost:8080/api/carts/secure/delete/cart/${userId}/${props.cartItem.id}?size=${props.cartItem.size}&color=${props.cartItem.color}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    props.onDelete(props.cartItem.id);
    updateCartCount();
    console.log(response);
  };
  return (
    <div className="cart-data" key={props.cartItem.id}>
      <img
        onClick={() => navigate(`/product/${props.cartItem.id}`)}
        src={props.cartItem.image}
        alt=""
        className="cart-item-img"
      />
      <div className="cart-all-data">
        <p className="cart-title">{props.cartItem.title}</p>
        <div className="cart-price">
          <p className="cart-discount">
            ${(props.cartItem.price * props.cartItem.quantity).toFixed(1)}
          </p>
          <p
            style={
              props.cartItem.category === "men's clothing" ||
              props.cartItem.category === "women's clothing"
                ? { display: "block" }
                : { display: "none" }
            }
            className="cart-size"
          >
            Size: {props.cartItem.size ? props.cartItem.size : "Not choosen"}
          </p>
          <p
            style={
              props.cartItem.category === "men's clothing" ||
              props.cartItem.category === "women's clothing"
                ? { display: "block" }
                : { display: "none" }
            }
            className="cart-size"
          >
            Color: {props.cartItem.color ? props.cartItem.color : "Not choosen"}
          </p>
        </div>
        <div className="more-buttons">
          <div className="quantity-section">
            <button className="increase" onClick={increaseItem}>
              +
            </button>
            <p className="total-items">{quantity}</p>
            <button onClick={decreaseItem} className="decrease">
              -
            </button>
          </div>
          <div className="right-btns">
            <div className="save-btn">
              <img
                //   onClick={() => {
                //     if (!isAdded(item.id)) {
                //       dispatch(AddToList(item));
                //     } else {
                //       dispatch(RemoveList(item.id));
                //     }
                //   }}
                src={require("../imgs/save.png")}
                className="save-img"
              />
              <p>Save</p>
            </div>
            <div className="delete-btn">
              <img
                onClick={deleteItem}
                src={require("../imgs/delete.png")}
                className="delete-img"
              />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
