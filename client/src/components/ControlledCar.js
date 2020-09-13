import React from "react";

const ControlledCar = ({
  x,
  y,
  link,
  actualWidth,
  actualHeight,
  width,
  height,
}) => {
  return (
    <div
      className="controlled-car"
      style={{
        left: `${x}px`,
        bottom: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            backgroundImage: `url(${link})`,
            position: "absolute",
            width: `${actualWidth}px`,
            height: `${actualHeight}px`,
            left: `${(width - actualWidth) / 2}px`,
            top: `${(height - actualHeight)}px`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ControlledCar;
