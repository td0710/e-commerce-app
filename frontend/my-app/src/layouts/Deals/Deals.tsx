import ProductModel from "../../models/ProductModel";
import { Navbar } from "../NavbarAndFooter/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lists.css";
import "./deals.css";
import Spinner from "../../utils/Spinner";
function Deals() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
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
  return (
    <div className="Deals">
      <p className="deals-head">Hot Deals 🔥</p>
      {loading && <Spinner />}
      <div className="deal-items">
        {products &&
          products.map((items) => {
            return (
              <div className="card" key={items.id}>
                <div className="card-img-data">
                  <img src={items.image} className="card-img" />
                  {/* <img
                    onClick={() => {
                      if (!isAdded(items.id)) {
                        dispatch(AddToList(items));
                      } else {
                        dispatch(RemoveList(items.id));
                      }
                    }}
                    src={isAdded(items.id) ? Added : Add}
                    className="add-list"
                  /> */}

                  {/* <NavLink to={`/product/${items.id}`} key={items.id}>
                    <button className="view">View product</button>
                  </NavLink> */}
                </div>
                <div className="card-data">
                  <p className="card-title">
                    {items.title.length >= 32
                      ? items.title.slice(0, 32) + ".."
                      : items.title}
                  </p>
                  <div className="category-rating">
                    <p className="card-category">{items.category}</p>
                    <div className="rating">
                      <img
                        src={require("../../imgs/rating.png")}
                        className="rating-img"
                      />
                      <img
                        src={require("../../imgs/rating.png")}
                        className="rating-img"
                      />
                      <img
                        src={require("../../imgs/rating.png")}
                        className="rating-img"
                      />
                      <img
                        src={require("../../imgs/rating.png")}
                        className="rating-img"
                      />
                      <img
                        src={require("../../imgs/rating.png")}
                        className="rating-img"
                      />
                      <p className="rating-text">
                        {/* {"5 " + "(" + items.reviewNumber + " reviews)"} */}
                      </p>
                    </div>
                  </div>
                  <div className="card-price">
                    <p className="discount">${items.price}</p>
                    <p className="mrp">${Math.round(items.price * 1.66)}</p>
                    <p className="price-off">(60% OFF)</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* <div className="lowerNav">
        {/* <LowerNav /> */}
      {/* </div> */}
      {/* <Footer /> */}
    </div>
  );
}

export default Deals;
