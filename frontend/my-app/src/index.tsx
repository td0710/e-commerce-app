import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Navbar } from "./component/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Navbar /> {/* Navbar nằm ngoài Routes */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
