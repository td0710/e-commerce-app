import "./App.css";
import { Homepage } from "./pages/Homepage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Signin } from "./pages/auth/Sigin";
import { Signup } from "./pages/auth/Signup";
import { UserProvider } from "./hooks/useAuth";
import ProtectedRoute from "./Routes/ProtectedRoute";
import { WishlistPage } from "./pages/WishlistPage";
import ProductPage from "./pages/products/ProductPage";
import CartPage from "./pages/CartPage";
import { LoadingPage } from "./pages/loading/loadingPage";
import { ProductsPage } from "./pages/products/ProductsPage";
import { PaymentPage } from "./pages/PaymentPage";
import { LoadingPayment } from "./pages/loading/loadingPayment";
import OrderPage from "./pages/orders/OrderPage";
import { EditOrderPage } from "./pages/orders/EditOrderPage";
import { AdminProductPage } from "./pages/products/AdminProduct";
import { AddProductPage } from "./pages/products/AddProductPage";
import AdminProtectedRoute from "./Routes/AdminProtectedRoute";
import { AdminOrdersPage } from "./pages/orders/AdminOrderPage";
import ChatPage from "./pages/chat/ChatPage";
import AdminChatPage from "./pages/chat/AdminChatPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={token ? "/homepage" : "/signin"} />}
          />

          <Route
            path="/signin"
            element={token ? <Navigate to="/homepage" /> : <Signin />}
          />
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
                  <Route path="chat" element={<ChatPage />} />
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
                  <Route
                    path="admin/orders"
                    element={
                      <AdminProtectedRoute>
                        <AdminOrdersPage />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/chat"
                    element={
                      <AdminProtectedRoute>
                        <AdminChatPage />
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
