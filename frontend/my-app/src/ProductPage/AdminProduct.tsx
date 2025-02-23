import axios from "axios";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../PaymentPage/payment.css";
import "../ProductPage/productpage.css";
import ProductModel from "../models/ProductModel";
import { useAuth } from "../Context/useAuth";
import ProductVariantModel from "../models/ProductVariantModel";

export const AdminProductPage = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [color, setColor] = useState("none");
  const [size, setSize] = useState("none");
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [variants, setVariants] = useState<ProductVariantModel[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const { updateCartCount } = useAuth();

  const userId = localStorage.getItem("id");
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);
  const handleCategory = (e: ChangeEvent<HTMLInputElement>) =>
    setCategory(e.target.value);
  const handlePrice = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(parseFloat(e.target.value));
  const handleImage = (e: ChangeEvent<HTMLInputElement>) =>
    setImage(e.target.value);

  const handleSize = (e: ChangeEvent<HTMLInputElement>, variantId: number) => {
    setSize(e.target.value);
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === variantId
          ? { ...variant, size: e.target.value }
          : variant
      )
    );
  };

  const handleColor = (e: ChangeEvent<HTMLInputElement>, variantId: number) => {
    setColor(e.target.value);
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === variantId
          ? { ...variant, color: e.target.value }
          : variant
      )
    );
  };

  const handleQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    variantId: number
  ) => {
    const value = e.target.value;
    setQuantity(parseInt(value, 10));
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === variantId
          ? { ...variant, stock: value === "" ? 0 : parseInt(value, 10) }
          : variant
      )
    );
  };

  const fetchProductDetails = async () => {
    try {
      const url = `http://localhost:8080/api/products/${id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setProduct(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
        setPrice(response.data.price);
        setImage(response.data.image);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchVariants = async () => {
      const url = `http://localhost:8080/api/products/${id}/variants`;

      const response = await axios.get(url);

      const variantsData: ProductVariantModel[] =
        response.data._embedded?.productVariants.map((variant: any) => ({
          id: parseInt(variant._links.self.href.split("/").pop()),
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
        }));
      setVariants(variantsData);
      console.log(1);
    };
    fetchVariants();
  }, [id]);

  const updateProductDetails = async () => {
    const url = `http://localhost:8080/api/products/secure/update/product/${id}`;
    const updatedProduct = {
      title,
      description,
      category,
      price: price,
      image: image,
    };

    try {
      await axios.put(url, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchProductDetails();
    } catch (error) {
      console.error(error);
    }
  };
  const updateQuantity = async (size: string, color: string) => {
    const url = `http://localhost:8080/api/products/secure/update/product/quantity/${id}?size=${size}&color=${color}&quantity=${quantity}`;

    console.log(size);
    console.log(color);

    console.log(quantity);

    const response = await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };
  useEffect(() => {
    fetchProductDetails();
  }, [id, token]);
  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="more-data">
          <div className="shipping-data animate">
            <div
              className={product ? `product-dataa1 animate` : `product-dataa1`}
            >
              <div className="item-image">
                <img
                  src={product?.image}
                  className={`item-img1 ${product?.image ? "img-style" : ""}`}
                />
              </div>
              <div className="product-details">
                <p className="item-title">{product?.title}</p>
                <p className="item-desc">{product?.description}</p>
                <div className="price-section">
                  <div className="item-rating">
                    <img
                      src={require("../imgs/rating.png")}
                      className="rating-img"
                    />
                    <img
                      src={require("../imgs/rating.png")}
                      className="rating-img"
                    />
                    <img
                      src={require("../imgs/rating.png")}
                      className="rating-img"
                    />
                    <img
                      src={require("../imgs/rating.png")}
                      className="rating-img"
                    />
                    <img
                      src={require("../imgs/rating.png")}
                      className="rating-img"
                    />
                    <p className="rating-no">20</p>
                  </div>
                </div>
                {Array.isArray(product?.variants) &&
                  product?.variants.some((v) => v.color !== "none") && (
                    <div style={{ display: "block" }} className="cloth-size">
                      <p className="choose">Choose a color</p>
                      <div className="options">
                        {Array.from(
                          new Set(product?.variants.map((v) => v.color))
                        ).map((c, index) => (
                          <p
                            key={index}
                            className={`size ${
                              color === c ? `size-clicked` : ""
                            }`}
                            onClick={() => setColor(c)}
                          >
                            {c}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                {product ? <hr className="horizontal" /> : ""}

                {color &&
                  product?.variants?.some(
                    (v) =>
                      v.color !== "none" &&
                      v.color === color &&
                      v.size !== null &&
                      v.size !== "none"
                  ) && (
                    <div style={{ display: "block" }} className="cloth-size">
                      <p className="choose">Choose a size</p>
                      <div className="options">
                        {color &&
                          Array.from(
                            new Set(
                              product?.variants
                                .filter((v) => v.color === color)
                                .map((v) => v.size)
                            )
                          ).map((s, index) => (
                            <p
                              key={index}
                              className={`size ${
                                size === s ? "size-clicked" : ""
                              }`}
                              onClick={() => setSize(s)}
                            >
                              {s}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}

                {(product && product?.category === "men's clothing") ||
                product?.category === "women's clothing" ? (
                  <hr className="horizontal" />
                ) : (
                  ""
                )}
                {product ? (
                  <div className="product-actual-price">
                    <p className="price-one">Price:</p>
                    <p className="price-two">${product?.price}</p>
                    <p className="mrp">${Math.round(product?.price * 1.66)}</p>
                  </div>
                ) : (
                  ""
                )}

                <div
                  style={product ? { display: "flex" } : { display: "none" }}
                  className="buying-buttons"
                ></div>
              </div>
            </div>
            <div className="user-data-form">
              <div className="shipping-head">Edit Product Details</div>
              <div className="all-data-of-user">
                <div className="user-data1">
                  <div className="country">
                    <p className="country-name">Title*</p>
                    <input
                      type="text"
                      placeholder="Title"
                      onChange={handleTitle}
                      value={title}
                      required
                    />
                  </div>
                  <div className="user-name">
                    <p className="user-fullname">Category*</p>
                    <input
                      type="text"
                      placeholder="Category"
                      onChange={handleCategory}
                      value={category}
                      required
                    />
                  </div>
                  <div className="user-contact">
                    <p className="user-number">Price*</p>
                    <input
                      type="number"
                      placeholder="Price"
                      onChange={handlePrice}
                      value={price}
                      required
                    />
                  </div>
                  <button
                    onClick={updateProductDetails}
                    className="save-address"
                  >
                    Save
                  </button>
                  <div className="shipping-head" style={{ marginTop: "20px" }}>
                    Create
                  </div>
                  <div
                    className="user-address"
                    style={{ display: "flex", alignItems: "self-end" }}
                  >
                    <input
                      type="text"
                      placeholder="Enter size"
                      required
                      style={{ width: "80px" }}
                    />
                    <input
                      type="text"
                      placeholder="Enter color"
                      required
                      style={{ width: "80px", marginLeft: "15px" }}
                    />
                    <input
                      type="text"
                      placeholder="Enter quantity"
                      required
                      style={{ width: "80px", marginLeft: "15px" }}
                    />
                    <button
                      className="save-address create"
                      style={{
                        height: "53px",
                        width: "90px",
                        marginLeft: "15px",
                      }}
                    >
                      Create
                    </button>
                  </div>
                </div>
                <div className="user-data2">
                  <div className="user-email">
                    <p className="user-fullname">Description*</p>
                    <textarea
                      placeholder="Description"
                      onChange={handleDescription}
                      value={description}
                      required
                      style={{
                        width: "420px",
                        height: "100px",
                        padding: "8px",
                        fontSize: "15px",
                        border: "1.5px solid rgb(174, 174, 174)",
                        borderRadius: "4px",
                        outline: "none",
                        resize: "none",
                        backgroundColor: "#fff",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                        fontFamily: "Poppins",
                      }}
                    />
                  </div>
                  <div className="user-address">
                    <p className="user-fulladdress">Image URL*</p>
                    <input
                      type="text"
                      placeholder="Image URL"
                      onChange={handleImage}
                      value={image}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="shipping-head" style={{ marginTop: "20px" }}>
                Edit Size And Color
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  width: "1000px",
                }}
              >
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="all-data-of-user"
                    style={{
                      display: "flex",
                      alignItems: "self-end",
                      gap: "15px",
                      width: "calc(50% - 7.5px)",
                    }}
                  >
                    <div className="user-address">
                      <input
                        type="text"
                        placeholder="Enter Size"
                        value={variant.size}
                        required
                        style={{ width: "35px" }}
                        disabled={true}
                        onChange={(e) => handleSize(e, variant.id)}
                      />
                    </div>
                    <div className="user-address">
                      <input
                        type="text"
                        placeholder="Enter Color"
                        value={variant.color}
                        required
                        style={{ width: "45px" }}
                        disabled={true}
                        onChange={(e) => handleColor(e, variant.id)}
                      />
                    </div>
                    <div className="user-address">
                      <input
                        type="text"
                        placeholder="Enter Quantity"
                        value={variant.stock}
                        required
                        style={{ width: "45px" }}
                        onChange={(e) => handleQuantity(e, variant.id)}
                      />
                    </div>
                    <button
                      className="save-address"
                      style={{ height: "53px" }}
                      onClick={() =>
                        updateQuantity(variant.size, variant.color)
                      }
                    >
                      Save
                    </button>
                    <button className="cancel-order" style={{ height: "53px" }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
