import React, { Fragment, useEffect, useState } from "react";
import ControlledCar from "../components/ControlledCar";
import MiddleRoadLines from "../components/MiddleRoadLines";
import UncontrolledCar from "../components/UncontrolledCar";
import ColorSample from "../components/ColorSample";
import carsArray from "../components/Cars";
import CarSample from "../components/CarSample";

const SPEED_START = 2;
const SPEED_INCREASE = 2;
const MAX_SPEED = 12;
const ROAD_WIDTH = 600;
const TOP_MAX = 620;
const BOTTOM_MAX = 20;
const GAP = 60;
const MIN_LEFT = 50;

let keyMap = new Map();
keyMap.set("ArrowUp", 1);
keyMap.set("w", 1);
keyMap.set("W", 1);
keyMap.set("ArrowDown", 2);
keyMap.set("s", 2);
keyMap.set("S", 2);
keyMap.set("ArrowRight", 3);
keyMap.set("d", 3);
keyMap.set("D", 3);
keyMap.set("ArrowLeft", 4);
keyMap.set("a", 4);
keyMap.set("A", 4);

const difficultyLevels = ["Easy", "Medium", "Hard"];

const colorValues = ["black", "green", "#996633", "#000099", "#660066"];

let moveUncontrolledCarTrigger;
let refreshCarsSeenTrigger;
let increaseScoreTrigger;
let increaseSpeedTrigger;

const Home = () => {
  const [controlledCar, setControlledCar] = useState({
    ...carsArray[0],
    x: 252,
    y: 30,
  });

  const [currSpeed, setSpeed] = useState(SPEED_START);
  const [previous, setPrevious] = useState(0); // up = 1; down = 2; right = 3; left = 4
  const [gameStarted, toggleGameStart] = useState(false);
  const [score, setScore] = useState(0);
  const [enemyCars, setEnemyCars] = useState([]);
  const [keyboardInputEnabled, toggleKeyboardInput] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, showUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, showPasswordError] = useState(false);

  const [isCarPickerOn, toggleCarPicker] = useState(true);
  const [enableUsernameLock, toggleLockUsername] = useState(false);

  const [enemyCarMaxSpeed, increaseEnemyMaxCarSpeed] = useState(MAX_SPEED);
  const [gameDifficulty, adjustGameDifficulty] = useState(0);
  const [chosenTopDifficultyLevel, changeChosenTopDifficultyLevel] = useState(
    0
  );
  const [selectedColorPosition, setSelectedColorPosition] = useState(0);
  const [selectedCarPosition, setSelectedCarPosition] = useState(0);

  // generate a random car on the screen
  function getRandomCar() {
    const randomCar = carsArray.filter((el) => el.link !== controlledCar.link)[
      parseInt(Math.random() * (carsArray.length - 2))
    ];
    return {
      ...randomCar,
      x:
        MIN_LEFT +
        parseInt(
          Math.random() * (ROAD_WIDTH - randomCar.width - MIN_LEFT).toFixed(0)
        ),
      y: TOP_MAX,
    };
  }

  // check password matches criteria
  function isPasswordGoodEnough(password) {
    return password.length > 4;
  }

  // handle user key presses to control the car
  useEffect(() => {
    function goUp() {
      if (
        controlledCar.y + currSpeed <
        TOP_MAX - controlledCar.actualHeight - currSpeed
      )
        setControlledCar({ ...controlledCar, y: controlledCar.y + currSpeed });
    }
    function goDown() {
      if (controlledCar.y - currSpeed > BOTTOM_MAX + currSpeed)
        setControlledCar({
          ...controlledCar,
          y: controlledCar.y - currSpeed,
        });
    }
    function goRight() {
      if (controlledCar.x + currSpeed < ROAD_WIDTH - controlledCar.width)
        setControlledCar({
          ...controlledCar,
          x: controlledCar.x + currSpeed,
        });
    }
    function goLeft() {
      if (controlledCar.x - currSpeed > 0 - currSpeed)
        setControlledCar({
          ...controlledCar,
          x: controlledCar.x - currSpeed,
        });
    }
    const handler = (event) => {
      event.preventDefault();
      if (!gameStarted) return;
      let currentKey = keyMap.get(event.key);
      if (previous === currentKey) {
        if (MAX_SPEED > currSpeed) setSpeed(currSpeed + SPEED_INCREASE);
      } else setSpeed(SPEED_START);
      setPrevious(currentKey);
      switch (currentKey) {
        case 1:
          goUp();
          break;
        case 2:
          goDown();
          break;
        case 3:
          goRight();
          break;
        case 4:
          goLeft();
          break;
        default:
          break;
      }
    };
    if (!keyboardInputEnabled) window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [
    controlledCar,
    setControlledCar,
    currSpeed,
    setSpeed,
    previous,
    setPrevious,
    gameStarted,
    keyboardInputEnabled,
  ]);

  // keep the cars coming
  useEffect(() => {
    if (gameStarted)
      moveUncontrolledCarTrigger = setInterval(() => {
        setEnemyCars(
          enemyCars.map((enemyCar) => {
            return {
              ...enemyCar,
              y: enemyCar.y - enemyCarMaxSpeed,
            };
          })
        );
      }, 110);

    return () => {
      clearInterval(moveUncontrolledCarTrigger);
    };
  }, [enemyCars, gameStarted, enemyCarMaxSpeed]);

  // add new cars, remove bottom unseen ones
  useEffect(() => {
    if (gameStarted)
      refreshCarsSeenTrigger = setInterval(() => {
        if (enemyCars.length === 0) return;
        const firstCar = enemyCars[0];
        const lastCar = enemyCars[enemyCars.length - 1];
        if (lastCar.y < 0 && lastCar.y < -lastCar.height - GAP) enemyCars.pop();
        if (
          firstCar.y + firstCar.height + controlledCar.actualHeight + GAP <
          TOP_MAX
        )
          enemyCars.unshift(getRandomCar());
      }, 50);

    return () => {
      clearInterval(refreshCarsSeenTrigger);
    };
  }, [gameStarted, enemyCars, controlledCar]);

  // increase score as time passes
  useEffect(() => {
    if (gameStarted) {
      increaseScoreTrigger = setInterval(() => {
        setScore(score + 1);
      }, 50);
    }

    return () => {
      clearInterval(increaseScoreTrigger);
    };
  }, [setScore, score, gameStarted]);

  // increase difficulty by accelerating cars
  useEffect(() => {
    if (gameStarted)
      increaseSpeedTrigger = setInterval(() => {
        increaseEnemyMaxCarSpeed(enemyCarMaxSpeed + 1);
      }, 15000);

    return () => {
      clearInterval(increaseSpeedTrigger);
    };
  }, [enemyCarMaxSpeed, gameStarted]);

  // check for collisions
  useEffect(() => {
    enemyCars.forEach((enemyCar) => {
      // If one rectangle is on left side of other
      if (
        enemyCar.x >= controlledCar.x + controlledCar.width ||
        controlledCar.x >= enemyCar.x + enemyCar.width
      )
        return;

      // If one rectangle is above other
      if (
        enemyCar.y + enemyCar.height <= controlledCar.y ||
        controlledCar.y + controlledCar.height <= enemyCar.y
      )
        return;

      toggleGameStart(false);
    });
  }, [controlledCar, enemyCars]);

  // start/stop a game
  function startGame() {
    if (gameDifficulty === 0) {
      increaseEnemyMaxCarSpeed(MAX_SPEED);
    } else if (gameDifficulty === 1) {
      increaseEnemyMaxCarSpeed(MAX_SPEED + 4);
    } else {
      increaseEnemyMaxCarSpeed(MAX_SPEED + 8);
    }
    setControlledCar({ ...controlledCar, x: 252, y: 30 });
    setScore(0);
    if (gameStarted) {
      toggleGameStart(false);
    } else {
      toggleGameStart(true);
      const randomCar = getRandomCar();
      setEnemyCars([randomCar]);
    }
  }

  return (
    <Fragment>
      <div className="flex-center-container">
        <div className="side-container">
          <ul className="top-scorers">
            <li className="header">
              Top 10
              <span className="split-btn">
                {difficultyLevels[chosenTopDifficultyLevel]}
              </span>
              <div className="dropdown">
                <span className="split-btn">
                  <i className="fa fa-caret-down"></i>
                </span>
                <div className="dropdown-content">
                  <span
                    onClick={() => {
                      changeChosenTopDifficultyLevel(0);
                    }}
                  >
                    Easy
                  </span>
                  <span
                    onClick={() => {
                      changeChosenTopDifficultyLevel(1);
                    }}
                  >
                    Medium
                  </span>
                  <span
                    onClick={() => {
                      changeChosenTopDifficultyLevel(2);
                    }}
                  >
                    Hard
                  </span>
                </div>
              </div>
            </li>
            {[...Array(10).keys()].map((el, index) => {
              switch (index) {
                case 0:
                  return (
                    <li key={index} className="first">
                      <i className="fas fa-trophy"></i>
                      {index}
                    </li>
                  );
                case 1:
                  return (
                    <li key={index} className="second">
                      <i className="fas fa-trophy"></i>
                      {index}
                    </li>
                  );
                case 2:
                  return (
                    <li key={index} className="third">
                      <i className="fas fa-trophy"></i>
                      {index}
                    </li>
                  );
                default:
                  return <li key={index}>{index}</li>;
              }
            })}
          </ul>
        </div>

        <div
          className="centered-container"
          style={{ backgroundColor: colorValues[selectedColorPosition] }}
        >
          <div className="bg-dark"></div>
          <div className="left-end-line" />
          {enemyCars.map((el, index) => (
            <UncontrolledCar key={index} {...el} />
          ))}
          <ControlledCar {...controlledCar} />

          <MiddleRoadLines gameStarted={gameStarted} />
          <div className="right-end-line" />
        </div>

        <div className="side-container">
          <div className="text-center">
            <h2>Score: {score}</h2>
            <div className="btn-group">
              <button
                onClick={() => {
                  adjustGameDifficulty(0);
                }}
                className={`${gameDifficulty === 0 && "selected"}`}
              >
                Easy
              </button>
              <button
                onClick={() => {
                  adjustGameDifficulty(1);
                }}
                className={`${gameDifficulty === 1 && "selected"}`}
              >
                Medium
              </button>
              <button
                onClick={() => {
                  adjustGameDifficulty(2);
                }}
                className={`${gameDifficulty === 2 && "selected"}`}
              >
                Hard
              </button>
            </div>
            <div>
              <span className="balloon-input-container">
                <input
                  className="balloon"
                  id="username"
                  type="text"
                  onFocus={() => toggleKeyboardInput(true)}
                  onBlur={() => toggleKeyboardInput(false)}
                  onChange={(e) => {
                    if (e.target.value) {
                      showUsernameError(false);
                    } else showUsernameError(true);
                    setUsername(encodeURI(e.target.value));
                  }}
                  placeholder="Your username"
                />
                <label htmlFor="username">Username</label>
              </span>
            </div>
            {usernameError && (
              <div className="error-message text-center">
                Please enter a username
              </div>
            )}
            {username && (
              <div className="text-center lock-username">
                <span
                  onClick={() => {
                    toggleLockUsername(!enableUsernameLock);
                  }}
                >
                  Lock my username
                </span>
                {enableUsernameLock && (
                  <Fragment>
                    <div>
                      <span className="balloon-input-container">
                        <input
                          className="balloon"
                          id="password"
                          type="password"
                          onFocus={() => toggleKeyboardInput(true)}
                          onBlur={() => toggleKeyboardInput(false)}
                          onChange={(e) => {
                            if (isPasswordGoodEnough(e.target.value)) {
                              showPasswordError(false);
                            } else showPasswordError(true);
                            setPassword(e.target.value);
                          }}
                          placeholder="Your password"
                        />
                        <label htmlFor="password">Password</label>
                      </span>
                    </div>
                    {passwordError && (
                      <div className="error-message text-center">
                        Password minimum 5 characters
                      </div>
                    )}
                  </Fragment>
                )}
              </div>
            )}
            {gameStarted ? (
              <button
                className="btn-start"
                onClick={() => {
                  startGame();
                }}
              >
                <i className="far fa-stop-circle"></i> Stop
              </button>
            ) : (
              <button
                className="btn-start"
                onClick={() => {
                  if (username) {
                    showUsernameError(false);
                    startGame();
                  } else {
                    showUsernameError(true);
                  }
                }}
              >
                <i className="far fa-play-circle"></i> Start
              </button>
            )}
            {!gameStarted && (
              <div>
                <div className="btn-group">
                  <button
                    onClick={() => {
                      toggleCarPicker(true);
                    }}
                    className={`${isCarPickerOn && "selected"}`}
                  >
                    Change Car
                  </button>
                  <button
                    onClick={() => {
                      toggleCarPicker(false);
                    }}
                    className={`${!isCarPickerOn && "selected"}`}
                  >
                    Change Road
                  </button>
                </div>
                <div className="picker-container">
                  {isCarPickerOn
                    ? carsArray.map((el, index) => (
                        <CarSample
                          key={el.link}
                          car={el}
                          selected={index === selectedCarPosition}
                          onChange={() => {
                            setControlledCar({
                              ...carsArray[index],
                              x: 252,
                              y: 30,
                            });
                            setSelectedCarPosition(index);
                          }}
                        />
                      ))
                    : colorValues.map((el, index) => (
                        <ColorSample
                          key={el}
                          color={el}
                          selected={index === selectedColorPosition}
                          onChange={() => {
                            setSelectedColorPosition(index);
                          }}
                        />
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
