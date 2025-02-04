import ProductModel from "../../models/ProductModel";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lists.css";
import "./deals.css";
import Spinner from "../../utils/Spinner";
import Footer from "../NavbarAndFooter/Footer";
import { List } from "./List";

function Deals() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [add, isAdd] = useState(false);
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
      const url = `http://localhost:8080/api/products`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.products;

      const loadedProducts: ProductModel[] = [];

      console.log(responseData);

      for (const key in responseData) {
        loadedProducts.push({
          id: responseData[key].id,
          title: responseData[key].title,
          description: responseData[key].description,
          category: responseData[key].category,
          price: responseData[key].price,
          image: responseData[key].image,
        });
      }
      setProducts(loadedProducts);
      setLoading(false);
    };
    fetchProducts().catch((error: any) => {
      console.log(error.messages);
    });
  }, []);
  useEffect(() => {
    const addWishlist = async () => {};
  });
  const setadd = () => {
    isAdd(true);
  };
  return (
    <div className="Deals">
      <p className="deals-head">Hot Deals 🔥{localStorage.getItem("id")}</p>
      {loading && <Spinner />}
      <div className="deal-items">
        {products &&
          products.map((items) => {
            return <List product={items} key={items.id}></List>;
          })}
      </div>
      {/* <div className="lowerNav">
        {/* <LowerNav /> */}
      {/* </div> */}
      <Footer />
    </div>
  );
}

export default Deals;
