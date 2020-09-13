import React from "react";

/*
 * side
 * 0 = left; 1 = right;
 */

const UncontrolledCar = ({
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
      className="uncontrolled-car"
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
            top: `${height - actualHeight}px`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default UncontrolledCar;
