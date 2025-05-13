import { Banner } from "../components/home/Banner";
import { Navbar } from "../components/Navbar";
import "../App.css";
import "../asserts/css/lists.css";
import Deals from "../components/home/Deals";
import Footer from "../components/Footer";
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
