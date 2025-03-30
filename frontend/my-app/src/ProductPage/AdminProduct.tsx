import axios from "axios";
import { Navbar } from "../layouts/NavbarAndFooter/Navbar";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../PaymentPage/payment.css";
import "../ProductPage/productpage.css";
import ProductModel from "../models/ProductModel";
import ProductVariantModel from "../models/ProductVariantModel";
import Footer from "../layouts/NavbarAndFooter/Footer";
import swal from "sweetalert";
import Swal from "sweetalert2";
import api from "../configuration/axiosconf";
export const AdminProductPage = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [variants, setVariants] = useState<ProductVariantModel[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [saveVariant, setSaveVariant] = useState(false);
  const [saveQuantity, setSaveQuantity] = useState("");
  const navigate = useNavigate();
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);
  const handleCategory = (e: ChangeEvent<HTMLInputElement>) =>
    setCategory(e.target.value);
  const handlePrice = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(parseFloat(e.target.value));

  const handleSize = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
  };
  const handleColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  const handleSaveQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    setSaveQuantity(e.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    variantId: number
  ) => {
    const value = e.target.value;
    setQuantity(value);
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
      const url = `${process.env.REACT_APP_API_URL}/api/products/${id}`;
      const response = await api.get(url, {
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
        setSelectedImage(response.data.image);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchVariants = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/products/${id}/variants`;

    const response = await api.get(url);

    const variantsData: ProductVariantModel[] =
      response.data._embedded?.productVariants.map((variant: any) => ({
        id: parseInt(variant._links.self.href.split("/").pop()),
        color: variant.color,
        size: variant.size,
        stock: variant.stock,
      }));
    variantsData.sort((a, b) => a.color.localeCompare(b.color));
    setVariants(variantsData);
  };
  useEffect(() => {
    fetchVariants();
  }, []);

  const updateProductDetails = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/products/secure/update/product/${id}`;
    const updatedProduct = {
      title,
      description,
      category,
      price: price,
      image: selectedImage,
    };

    try {
      const response = await api.put(url, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Save product successfully",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        fetchProductDetails();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateQuantity = async (size: string, color: string) => {
    if (quantity === "") {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "Please change quantity",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      return;
    }
    const url = `${process.env.REACT_APP_API_URL}/api/products/secure/update/product/quantity/${id}?size=${size}&color=${color}&quantity=${quantity}`;

    const response = await api.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "Saved successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    setQuantity("");
  };
  const createVariant = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/products/secure/create/variant/${id}?size=${size}&color=${color}&quantity=${saveQuantity}`;

    const response = await api.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    setSaveQuantity("");
    setSize("");
    setColor("");
    fetchVariants();
  };
  useEffect(() => {
    fetchProductDetails();
  }, []);

  const deleteVariant = async (size: string, color: string) => {
    const url = `${process.env.REACT_APP_API_URL}/api/products/secure/delete/variant/${id}?size=${size}&color=${color}`;
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    fetchVariants();
  };

  const deleteProduct = async () => {
    const url = `${process.env.REACT_APP_API_URL}/api/products/secure/delete/product/${id}`;

    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    navigate("/homepage");
  };
  async function base64ConversionForImages(e: any) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error", error);
    };
  }
  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="more-data">
          <div className="shipping-data animate">
            <div className={`product-dataa1 animate`}>
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
                  <div style={{ display: "flex", gap: "15px" }}>
                    <button
                      onClick={updateProductDetails}
                      className="save-address"
                    >
                      Save Product
                    </button>
                    <button
                      className="cancel-order"
                      style={{ height: "53px" }}
                      onClick={() => {
                        swal({
                          title: "Are you sure?",
                          text: "Once deleted, you will not be able to recover this item!",
                          icon: "warning",
                          buttons: ["Cancel", "Yes, delete it!"],
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            deleteProduct();
                          }
                        });
                      }}
                    >
                      Delete Product
                    </button>
                  </div>

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
                      onClick={() => {
                        if (
                          size === "" ||
                          color === "" ||
                          saveQuantity === ""
                        ) {
                          Swal.fire({
                            toast: true,
                            position: "top",
                            icon: "warning",
                            title:
                              "Please fill in all required fields before creating.",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                          });

                          return;
                        }
                        createVariant();
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
                      type="file"
                      onChange={(e) => base64ConversionForImages(e)}
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
                        onClick={() => setSaveVariant(true)}
                        onChange={(e) => handleQuantity(e, variant.id)}
                      />
                    </div>
                    <button
                      className="save-address"
                      style={{ height: "53px" }}
                      disabled={!saveVariant && true}
                      onClick={() =>
                        updateQuantity(variant.size, variant.color)
                      }
                    >
                      Save
                    </button>
                    <button
                      className="cancel-order"
                      onClick={() => deleteVariant(variant.size, variant.color)}
                      style={{ height: "53px" }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
