import React from "react";

const CarSample = ({ selected, car, onChange }) => {
  if (selected)
    return (
      <div
        className="square-select car"
        style={{
          position: "relative",
          backgroundImage: `url(${car.link})`,
        }}
      >
        <i className="fas fa-check-circle"></i>
      </div>
    );
  return (
    <div
      className="square-select car"
      style={{
        backgroundImage: `url(${car.link})`,
        
      }}
      onClick={() => {
        onChange();
      }}
    ></div>
  );
};

export default CarSample;
