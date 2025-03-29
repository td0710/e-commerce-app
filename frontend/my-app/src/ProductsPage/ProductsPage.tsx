import axios, { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { Link } from "react-router-dom";
import Footer from "../layouts/NavbarAndFooter/Footer";
import ProductModel from "../models/ProductModel";
import { useAuth } from "../Context/useAuth";
import { List } from "../layouts/Deals/List";
import { Pagination } from "../utils/Pagination";
import { Category } from "./Category";

export const ProductsPage = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [category, setCatergory] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(15);
  const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [add, isAdd] = useState(false);
  const { updateWishlistCount, updateCartCount } = useAuth();
  const productRef = useRef<HTMLParagraphElement | null>(null);
  document.title = "Products section";

  const handleDelete = (id: number) => {
    setProducts((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "";
        if (category === "all") {
          url = `${
            process.env.REACT_APP_API_URL
          }/api/products/secure/getall?page=${
            currentPage - 1
          }&size=${productPerPage}`;
        } else {
          url = `${
            process.env.REACT_APP_API_URL
          }/api/products/secure/category?page=${
            currentPage - 1
          }&size=${productPerPage}&category=${category}`;
        }

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
        setTotalPages(response.data.totalPages);

        updateWishlistCount();
        updateCartCount();

        setTimeout(() => {
          productRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error fetching products:", axiosError);

        if (axiosError.response && axiosError.response.data) {
          const backendMessage =
            (axiosError.response.data as any).error || "Unknown error";
          setErrorMessage(backendMessage);
        } else {
          setErrorMessage(
            "Failed to load products. Please check your internet connection."
          );
        }
      }
    };

    fetchProducts();
  }, [currentPage, category]);

  const paginate = (pageNumer: number) => setCurrentPage(pageNumer);

  return (
    <>
      <Navbar />

      <div style={{ height: "100%" }} className="content">
        <div className={products ? `lists animate` : `lists`}>
          <p className="wishlist-head" ref={productRef}>
            All Products
          </p>
          <Category
            findCategory={category}
            setCategory={setCatergory}
          ></Category>
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
          {!errorMessage && (
            <div
              style={
                products.length === 0
                  ? { display: "flex" }
                  : { display: "none" }
              }
              className="empty-list"
            >
              <img src={require("../imgs/empty.png")} className="empty-img" />
              <div className="empty-text">
                <p className="empty-head">It's empty here!</p>
                <p className="empty-desc">
                  "Don't let your wishlist collect dust. Add some items that
                  bring joy to your life and watch as they become a reality with
                  just a few clicks."
                </p>
                <Link to="/homepage">
                  <button className="shopping">Go Shopping</button>
                </Link>
              </div>
            </div>
          )}
          <div className="lists-items">
            {products &&
              products.length > 0 &&
              products.map((items) => {
                return <List product={items} key={items.id}></List>;
              })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            ></Pagination>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
