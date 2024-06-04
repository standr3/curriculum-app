import React from "react";

const Slider = ({ className = "slider", onChange }) => {
  return (
    <input
      type="range"
      min="1"
      max="100"
      defaultValue="6"
      className={className}
      onChange={onChange}
    />
  );
};

export default Slider;
