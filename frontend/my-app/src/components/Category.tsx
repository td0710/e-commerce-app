import React, { useState } from "react";
import "../asserts/css/popular.css";

import men from "../asserts/imgs/men.png";
import jwellery from "../asserts/imgs/jwelery.png";
import electronics from "../asserts/imgs/pc.png";
import perfume from "../asserts/imgs/perfume-black.png";
import beauty from "../asserts/imgs/beauty-black.png";
import MenWhite from "../asserts/imgs/men-white.png";
import JwelleryWhite from "../asserts/imgs/jwelery-white.png";
import ElectronicsWhite from "../asserts/imgs/pc-white.png";
import perfumeWhite from "../asserts/imgs/perfume-white.png";
import beautyWhite from "../asserts/imgs/beauty-white.png";

import "../asserts/css/popular.css";

export const Category: React.FC<{
  findCategory: string;
  setCategory: (category: string) => void;
}> = (props) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const images = [
    {
      src: electronics,
      whiteSrc: ElectronicsWhite,
      className: "electronics",
      category: "electronics",
    },
    {
      src: jwellery,
      whiteSrc: JwelleryWhite,
      className: "jwellery",
      category: "jewelery",
    },
    { src: men, whiteSrc: MenWhite, className: "men", category: "clothing" },
    {
      src: perfume,
      whiteSrc: perfumeWhite,
      className: "men",
      category: "fragrances",
    },
    {
      src: beauty,
      whiteSrc: beautyWhite,
      className: "men",
      category: "beauty",
    },
  ];

  const setCatergory = (category: string, index: number) => {
    if (category == props.findCategory) {
      props.setCategory("all");
      setActiveIndex(-1);
    } else {
      props.setCategory(category);
      setActiveIndex(index);
    }
  };

  return (
    <>
      <div className="popular">
        <div className="popular-items">
          {images.map((image, index) => (
            <img
              key={index}
              src={index === activeIndex ? image.whiteSrc : image.src}
              className={
                index === activeIndex
                  ? image.className + " active"
                  : image.className
              }
              title={image.className}
              style={{
                backgroundColor: index === activeIndex ? "#1c2228" : "white",
              }}
              onClick={() => setCatergory(image.category, index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
