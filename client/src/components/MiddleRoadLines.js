import React from "react";

const MiddleLine = ({ gameStarted }) => {
  return (
    <div
      className="middle-road-lines"
      style={{ animationName: `${gameStarted ? "godown" : ""}` }}
    >
      <div className="middle-line zero" />
      <div className="middle-line one" />
      <div className="middle-line two" />
      <div className="middle-line three" />
      <div className="middle-line four" />
      <div className="middle-line five" />
      <div className="middle-line six" />
      <div className="middle-line seven" />
      <div className="middle-line eight" />
      <div className="middle-line nine" />
    </div>
  );
};

export default MiddleLine;
