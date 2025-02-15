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

  const [loading, setLoading] = useState(true);
  const [add, isAdd] = useState(false);
  const { updateWishlistCount, updateCartCount } = useAuth();

  const productRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log(123);
      const url = `http://localhost:8080/api/products/secure/getall?page=0
      &size=12`;

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
      updateWishlistCount();
      updateCartCount();
      setTimeout(() => {
        productRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    };
    fetchProducts().catch((error: any) => {
      console.log(error.messages);
    });
  }, []);

  return (
    <div className="Deals">
      <p className="deals-head" ref={productRef}>
        Hot Deals 🔥 {localStorage.getItem("id")}
      </p>
      {loading && <Spinner />}
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
