import React from "react";
import "./App.css";
import { Homepage } from "./layouts/Homepage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Signin } from "./layouts/Signin/Sigin";
import { Signup } from "./layouts/Signup/Signup";
import { UserProvider } from "./Context/useAuth";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { WishlistPage } from "./WishlistPage/WishlistPage";
import ProductPage from "./ProductPage/ProductPage";
import CartPage from "./CartPage/CartPage";
import { LoadingPage } from "./LoadingPage/loadingPage";
import { ProductsPage } from "./ProductsPage/ProductsPage";
import { PaymentPage } from "./PaymentPage/PaymentPage";
import { LoadingPayment } from "./LoadingPage/loadingPayment";
import OrderPage from "./OrderPage/OrderPage";
import { EditOrderPage } from "./EditOrderPage/EditOrderPage";
import { AdminProductPage } from "./ProductPage/AdminProduct";
import { AddProductPage } from "./ProductPage/AddProductPage";
import AdminProtectedRoute from "./Routes/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/google/callback" element={<LoadingPage />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="homepage" element={<Homepage />} />
                  <Route path="wishlists" element={<WishlistPage />} />
                  <Route path="product/:id" element={<ProductPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="payment" element={<PaymentPage />} />
                  <Route path="vnpay" element={<LoadingPayment />} />
                  <Route path="order" element={<OrderPage />} />
                  <Route
                    path="edit-order/:orderId"
                    element={<EditOrderPage />}
                  />
                  <Route
                    path="admin/product/:id"
                    element={
                      <AdminProtectedRoute>
                        <AdminProductPage />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/add/product"
                    element={
                      <AdminProtectedRoute>
                        <AddProductPage />
                      </AdminProtectedRoute>
                    }
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
