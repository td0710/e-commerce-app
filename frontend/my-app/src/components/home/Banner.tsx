import { useState } from "react";
import "../../asserts/css/home.css";
import "../../asserts/css/lists.css";
import "../../App.css";
import { Link } from "react-router-dom";
export const Banner = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  document.title = "Amazon";

  const handleScroll = () => {
    window.scrollTo({
      top: scrollPosition + 750,
      behavior: "smooth",
    });
    setScrollPosition(scrollPosition + 750);
    setTimeout(() => {
      setScrollPosition(0);
    }, 100);
  };
  return (
    <div>
      <div className="poster-area">
        <div className="poster-data">
          <p className="poster-head">Free Delivery!</p>
          <p className="poster-desc">
            Don't miss it out! Only today, get free{" "}
            <b style={{ fontSize: "22px" }}>Next Day</b> delivery on all your
            orders.
          </p>
        </div>
        <Link to="/products" className="browse-btn">
          All Products
        </Link>
      </div>
      <img
        className="delivery"
        src={require("../../asserts//imgs/delivery.png")}
      />
    </div>
  );
};
