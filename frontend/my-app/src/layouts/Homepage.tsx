import { Banner } from "./Banner/Banner";
import { Navbar } from "./NavbarAndFooter/Navbar";
import "../App.css";
import "./Deals/lists.css";
import Deals from "./Deals/Deals";
import Footer from "./NavbarAndFooter/Footer";
export const Homepage = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="content">
        <Banner></Banner>
        <Deals></Deals>
      </div>
    </>
  );
};
