import ProductCartModel from "../models/ProductCartModel";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import axios from "axios";
import { useAuth } from "../Context/useAuth";
import { useEffect, useState } from "react";
export const CartItems: React.FC<{
  cartItem: ProductCartModel;
  onDelete: (id: number) => void;
  onSelect: (id: number, quantity: number) => void;
  onSelectIn: (id: number, quantity: number) => void;
  onSelectDe: (id: number, quantity: number) => void;
  isSelected: boolean;
}> = (props) => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [quantity, setQuantity] = useState(props.cartItem.quantity);
  const [add, setAdd] = useState(false);

  const { updateCartCount, updateWishlistCount } = useAuth();

  const handleItemClick = (e: React.MouseEvent) => {
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest(".increase") ||
        e.target.closest(".decrease") ||
        e.target.closest(".save-btn"))
    ) {
      return;
    }
    props.onSelect(props.cartItem.cartItemId, quantity);
  };
  const increaseItem = async () => {
    console.log(props.cartItem);

    const url = `http://localhost:8080/api/carts/secure/add/cartpage/${userId}/${props.cartItem.id}`;
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
      const newQuantity = prev + 1;

      return newQuantity;
    });
    props.onSelectIn(props.cartItem.cartItemId, quantity);
    updateCartCount();
  };
  const handleDecrease = async () => {
    await decreaseItem();
  };
  const handleIncrease = async () => {
    await increaseItem();
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
    props.onSelectDe(props.cartItem.cartItemId, quantity);
    updateCartCount();
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
  };
  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !token) return;
      try {
        const url = `http://localhost:8080/api/wishlists/secure/check/${userId}?productId=${props.cartItem.productId}`;
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
  }, [props.cartItem.id, userId, token, updateWishlistCount]);

  const addControll = async () => {
    if (add) {
      const url = `http://localhost:8080/api/wishlists/secure/delete/${userId}?productId=${props.cartItem.productId}`;
      const data = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAdd(false);
    } else {
      console.log(localStorage.getItem("token"));
      const url = `http://localhost:8080/api/wishlists/secure/add/${userId}?productId=${props.cartItem.productId}`;
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

    console.log("kkk");
  };

  return (
    <div
      className={`cart-data ${props.isSelected ? "selected" : ""}`}
      key={props.cartItem.id}
      onClick={handleItemClick}
    >
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
          <p style={{ display: "block" }} className="cart-size">
            Size:{" "}
            {props.cartItem.size && props.cartItem.size != "none"
              ? props.cartItem.size
              : "Not choosen"}
          </p>
          <p style={{ display: "block" }} className="cart-size">
            Color:{" "}
            {props.cartItem.color && props.cartItem.color != "none"
              ? props.cartItem.color
              : "Not choosen"}
          </p>
        </div>
        <div className="more-buttons">
          <div className="quantity-section">
            <button className="increase" onClick={handleIncrease}>
              +
            </button>
            <p className="total-items">{quantity}</p>
            <button onClick={handleDecrease} className="decrease">
              -
            </button>
          </div>
          <div className="right-btns">
            <div className="save-btn">
              <img
                onClick={addControll}
                src={
                  add
                    ? require("../imgs/saved.png")
                    : require("../imgs/save.png")
                }
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
