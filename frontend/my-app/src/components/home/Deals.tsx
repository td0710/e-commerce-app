import ProductModel from "../../models/ProductModel";
import { useEffect, useRef, useState } from "react";
import "../../asserts/css/lists.css";
import "../../asserts/css/deals.css";
import Spinner from "../Spinner";
import Footer from "../Footer";
import { List } from "./List";
import { useAuth } from "../../hooks/useAuth";
import { AxiosError } from "axios";
import api from "../../configuration/axiosconf";
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
        const url = `${process.env.REACT_APP_API_URL}/api/products/secure/getall?page=0&size=12`;

        const response = await api.get(url, {
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
        const axiosError = error as AxiosError;
        console.log(axiosError);
        console.error("Error fetching orders:", axiosError);
        if (
          axiosError.response &&
          (axiosError.response.data as any).code === "1009"
        ) {
          setErrorMessage("");
        } else if (axiosError.response && axiosError.response.data) {
          const errorMessage =
            (axiosError.response.data as any).message ||
            "Unknown error occurred";
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage("Failed to load products. Please try again.");
        }
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="Deals">
      <p className="deals-head" ref={productRef}>
        Hot Deals 🔥
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
