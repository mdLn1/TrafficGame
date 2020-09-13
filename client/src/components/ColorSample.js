import React from "react";

const ColorSample = ({ color = "black", selected = false, onChange }) => {
  if (selected)
    return (
      <div
        className="square-select"
        style={{
          position: "relative",
          backgroundColor: color,
        }}
      >
        <i className="fas fa-check-circle"></i>
      </div>
    );
  return (
    <div
      className="square-select"
      style={{
        backgroundColor: color,
      }}
      onClick={() => {
        onChange();
      }}
    ></div>
  );
};

export default ColorSample;
