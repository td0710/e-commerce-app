import { ChangeEvent, useState } from "react";
import ProductVariantModel from "../models/ProductVariantModel";
import ProductModel from "../models/ProductModel";
import "../PaymentPage/payment.css";
import "../OrderPage/orders.css";
import "./productpage.css";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import Footer from "../layouts/NavbarAndFooter/Footer";
import axios from "axios";
import { useAuth } from "../Context/useAuth";

export const AddProductPage = () => {
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [variants, setVariants] = useState<ProductVariantModel[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [saveQuantity, setSaveQuantity] = useState("");
  const { token } = useAuth();
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

  const handleSize = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
  };
  const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  const handleSaveQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setSaveQuantity(e.target.value);
  };
  const createVariant = () => {
    const newVariant: ProductVariantModel = {
      size: size,
      color: color,
      stock: parseInt(saveQuantity),
      id: 0,
      productId: 0,
    };

    setVariants([...variants, newVariant]);
    setSize("");
    setColor("");
    setSaveQuantity("");
  };

  const deleteVariant = (size: string, color: string, quantity: number) => {
    setVariants(
      variants.filter(
        (v) => !(v.size === size && v.color === color && v.stock === quantity)
      )
    );
  };

  const saveProduct = async () => {
    const newProduct = new ProductModel(
      Date.now(),
      title,
      description,
      category,
      price,
      image,
      variants
    );
    const url = `http://localhost:8080/api/products/secure/create/product`;
    console.log(newProduct);
    const response = axios.post(url, newProduct, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="more-data">
          <div className="shipping-data animate">
            <div className={`product-dataa1 animate`}>
              <div className="user-data-form">
                <div className="shipping-head">Add Product</div>
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
                    <div
                      className="shipping-head"
                      style={{ marginTop: "20px" }}
                      onClick={() =>
                        size === "" &&
                        color === "" &&
                        saveQuantity === "" &&
                        createVariant
                      }
                    >
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
                        onChange={handleSize}
                        style={{ width: "80px" }}
                        value={size}
                      />
                      <input
                        type="text"
                        placeholder="Enter color"
                        required
                        onChange={handleColor}
                        style={{ width: "80px", marginLeft: "15px" }}
                        value={color}
                      />
                      <input
                        type="text"
                        placeholder="Enter quantity"
                        required
                        onChange={handleSaveQuantity}
                        style={{ width: "80px", marginLeft: "15px" }}
                        value={saveQuantity}
                      />
                      <button
                        className="save-address create"
                        style={{
                          height: "53px",
                          width: "90px",
                          marginLeft: "15px",
                        }}
                        onClick={() =>
                          size !== "" &&
                          color !== "" &&
                          saveQuantity !== "" &&
                          createVariant()
                        }
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
                        />
                      </div>
                      <div className="user-address">
                        <input
                          type="text"
                          placeholder="Enter Quantity"
                          value={variant.stock}
                          required
                          style={{ width: "45px" }}
                          disabled={true}
                        />
                      </div>
                      <button
                        className="cancel-order"
                        style={{ height: "53px" }}
                        onClick={() =>
                          deleteVariant(
                            variant.size,
                            variant.color,
                            variant.stock
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="save-address"
                  style={{ height: "53px" }}
                  onClick={saveProduct}
                  disabled={
                    !title ||
                    !description ||
                    !category ||
                    !price ||
                    !image ||
                    variants.length === 0
                  }
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
