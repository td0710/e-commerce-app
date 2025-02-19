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
function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/auth/google/callback" element={<LoadingPage />} />
          <Route
            path="/wishlists"
            element={
              <ProtectedRoute>
                <WishlistPage></WishlistPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage></ProductsPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage></PaymentPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vnpay"
            element={
              <ProtectedRoute>
                <LoadingPayment></LoadingPayment>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage></OrderPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
