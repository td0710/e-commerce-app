import React from "react";
import "./App.css";
import { Homepage } from "./layouts/Homepage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Signin } from "./layouts/Signin/Sigin";
import { Signup } from "./layouts/Signup/Signup";
import { UserProvider } from "./Context/useAuth";
import ProtectedRoute from "./Routes/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/homepage"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
