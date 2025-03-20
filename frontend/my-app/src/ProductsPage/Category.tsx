import React, { useState } from "react";
import "./popular.css";

import men from "./Img/men.png";
import jwellery from "./Img/jwelery.png";
import electronics from "./Img/pc.png";
import perfume from "./Img/perfume-black.png";
import beauty from "./Img/beauty-black.png";
import MenWhite from "./Img/men-white.png";
import JwelleryWhite from "./Img/jwelery-white.png";
import ElectronicsWhite from "./Img/pc-white.png";
import perfumeWhite from "./Img/perfume-white.png";
import beautyWhite from "./Img/beauty-white.png";

import "./popular.css";

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
