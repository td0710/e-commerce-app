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

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(12);
  const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [add, isAdd] = useState(false);
  const { updateWishlistCount } = useAuth();

  const productRef = useRef<HTMLParagraphElement | null>(null); // Định kiểu ref

  useEffect(() => {
    const fetchProducts = async () => {
      // for (let i = 0; i < localStorage.length; i++) {
      //   let key = localStorage.key(i); // Lấy key của mục tại vị trí i
      //   if (key !== null) {
      //     // Kiểm tra xem key có hợp lệ không
      //     let value = localStorage.getItem(key); // Lấy giá trị của mục
      //     console.log(key + ": " + value); // In key và giá trị
      //   }
      // }
      console.log(123);
      const url = `http://localhost:8080/api/products/secure/getall?page=${
        currentPage - 1
      }&size=${productPerPage}`;

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
      setLoading(false);
      updateWishlistCount();
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
  }, [currentPage]);
  const paginate = (pageNumer: number) => setCurrentPage(pageNumer);
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      ></Pagination>
      {/* <div className="lowerNav">
        {/* <LowerNav /> */}
      {/* </div> */}
      <Footer />
    </div>
  );
}

export default Deals;
