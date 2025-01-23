import React from "react";

function Spinner() {
  return (
    <>
      <div className="spinner">
        <img
          style={{ width: "80px", marginTop: "50px" }}
          src={require("../imgs/loading.gif")}
        />
      </div>
    </>
  );
}

export default Spinner;
