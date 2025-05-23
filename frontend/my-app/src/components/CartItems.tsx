import ProductCartModel from "../models/ProductCartModel";
import { useNavigate } from "react-router-dom";
import "../asserts/css/cart.css";
import axios, { AxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
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
    const url = `${process.env.REACT_APP_API_URL}/api/carts/secure/add/cartpage/${userId}/${props.cartItem.id}`;

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

      setQuantity((prev) => prev + 1);
      props.onSelectIn(props.cartItem.cartItemId, quantity);
      updateCartCount();

      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Increased quantity successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "Something went wrong!";

      if (axiosError.response) {
        const responseData = axiosError.response?.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      }

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#F44336",
      });
    }
  };

  const handleDecrease = async () => {
    await decreaseItem();
  };
  const handleIncrease = async () => {
    await increaseItem();
  };

  const decreaseItem = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/carts/secure/decrease/cart/${userId}/${props.cartItem.id}?size=${props.cartItem.size}&color=${props.cartItem.color}`;

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

      setQuantity((prev) => {
        const newQuantity = prev - 1;
        if (newQuantity === 0) {
          props.onDelete(props.cartItem.id);
        }
        return newQuantity;
      });

      props.onSelectDe(props.cartItem.cartItemId, quantity);
      updateCartCount();

      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Decreased quantity successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      let errorMessage = "Something went wrong!";

      if (axiosError.response && typeof axiosError.response.data === "object") {
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      }

      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const deleteItem = async () => {
    if (!props.cartItem || !props.cartItem.id) {
      alert("Product information is missing.");
      return;
    }

    const url = `${process.env.REACT_APP_API_URL}/api/carts/secure/delete/cart/${userId}/${props.cartItem.id}?size=${props.cartItem.size}&color=${props.cartItem.color}`;

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      props.onDelete(props.cartItem.id);
      updateCartCount();

      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Item removed from cart",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = "Something went wrong!";

      if (axiosError.response && typeof axiosError.response.data === "object") {
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      }
      Swal.fire({
        toast: true,
        position: "top",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !token) return;
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/wishlists/secure/check/${userId}?productId=${props.cartItem.productId}`;
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
  }, [props.cartItem.id, userId, token, updateWishlistCount]);

  const addControll = async () => {
    if (add) {
      const url = `${process.env.REACT_APP_API_URL}/api/wishlists/secure/delete/${userId}?productId=${props.cartItem.productId}`;
      const data = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAdd(false);
    } else {
      const url = `${process.env.REACT_APP_API_URL}/api/wishlists/secure/add/${userId}?productId=${props.cartItem.productId}`;
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
        <p className="cart-title">
          {" "}
          {props.cartItem.title.length > 30
            ? props.cartItem.title.substring(0, 30) + "..."
            : props.cartItem.title}
        </p>
        <div className="cart-price">
          <p className="cart-discount">
            ${(props.cartItem.price * props.cartItem.quantity).toFixed(1)}
          </p>

          <p style={{ display: "block" }} className="cart-size">
            {props.cartItem.color !== "none"
              ? `Size :  ${props.cartItem.size}`
              : "\u00A0"}
          </p>

          {
            <p style={{ display: "block" }} className="cart-size">
              {props.cartItem.color !== "none"
                ? `Color :  ${props.cartItem.color}`
                : "\u00A0"}
            </p>
          }
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
                    ? require("../asserts/imgs/saved.png")
                    : require("../asserts/imgs/save.png")
                }
                className="save-img"
              />
              <p>Save</p>
            </div>
            <div className="delete-btn">
              <img
                onClick={deleteItem}
                src={require("../asserts/imgs/delete.png")}
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
