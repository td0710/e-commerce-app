import ProductModel from "../../models/ProductModel";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lists.css";
import "./deals.css";
import Spinner from "../../utils/Spinner";
import Footer from "../NavbarAndFooter/Footer";
import { List } from "./List";
import { useAuth } from "../../Context/useAuth";
import { Pagination } from "../../utils/Pagination";
import axios from "axios";

function Deals() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const token = localStorage.getItem("token");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [add, isAdd] = useState(false);
  const { updateWishlistCount, updateCartCount, updateOrderCount, orderCount } =
    useAuth();

  const productRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `http://localhost:8080/api/products/secure/getall?page=0&size=12`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
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

        setProducts(loadedProducts);
        setLoading(false);
        updateCartCount();
        updateOrderCount();
        updateWishlistCount();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message || "Could not fetch product cart!"
          );
        } else {
          setErrorMessage("Unexpected error!");
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="Deals">
      <p className="deals-head" ref={productRef}>
        Hot Deals 🔥 {orderCount}
      </p>
      {loading && <Spinner />}
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}

      <div className="deal-items">
        {products &&
          products.map((items) => {
            return <List product={items} key={items.id}></List>;
          })}
      </div>

      <Footer />
    </div>
  );
}

export default Deals;
