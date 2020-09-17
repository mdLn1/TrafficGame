import React, { Fragment, useEffect, useState } from "react";
import ControlledCar from "../components/ControlledCar";
import MiddleRoadLines from "../components/MiddleRoadLines";
import UncontrolledCar from "../components/UncontrolledCar";
import ColorSample from "../components/ColorSample";
import carsArray from "../components/Cars";
import CarSample from "../components/CarSample";
import axios from "axios";

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

const difficultyLevels = ["easy", "medium", "hard"];

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
  const [gameOver, toggleGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [enemyCars, setEnemyCars] = useState([]);
  const [keyboardInputEnabled, toggleKeyboardInput] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordRequired, togglePasswordRequired] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isCarPickerOn, toggleCarPicker] = useState(true);
  const [enableUsernameLock, toggleLockUsername] = useState(false);

  const [enemyCarMaxSpeed, increaseEnemyMaxCarSpeed] = useState(MAX_SPEED);
  const [gameDifficulty, adjustGameDifficulty] = useState(1);
  const [chosenTopDifficultyLevel, changeChosenTopDifficultyLevel] = useState(
    0
  );
  const [selectedColorPosition, setSelectedColorPosition] = useState(0);
  const [selectedCarPosition, setSelectedCarPosition] = useState(0);
  const [topScoresData, setTopScoresData] = useState(null);

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

  //check username satisfies conditions
  function checkUsername(val) {
    if (!Boolean(val)) {
      setUsernameError("Username field must be filled in");
    } else if (val.length > 19) {
      setUsernameError("Username must be max 20 characters long");
    } else {
      setUsernameError("");
      setUsername(val);
      axios
        .get(`/api/users/verify-username/?username=${val}`)
        .then(() => {
          togglePasswordRequired(false);
          setUsernameError("");
        })
        .catch((err) => {
          if (err?.response?.data?.errorCode === 1) {
            togglePasswordRequired(true);
            setUsernameError(
              "Username locked, password is required before start."
            );
          }
        });
    }
  }

  // check password matches criteria
  function checkPassword(val) {
    if (passwordRequired) {
      setPasswordError("");
      setPassword(val);
    } else {
      if (val.length < 4) {
        setPasswordError("A good password must have at least 4 characters");
      } else if (val.length > 99) {
        setPasswordError("Password cannot be longer than 100 characters");
      } else {
        setPasswordError("");
        setPassword(val);
      }
    }
  }

  // fetch top scores on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get("/api/scores/");
        setTopScoresData(resp.data.topScores);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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
      // If one rectangle is on left side of the other
      if (
        enemyCar.x >= controlledCar.x + controlledCar.width ||
        controlledCar.x >= enemyCar.x + enemyCar.width
      )
        return;

      // If one rectangle is above the other
      if (
        enemyCar.y + enemyCar.height <= controlledCar.y ||
        controlledCar.y + controlledCar.height <= enemyCar.y
      )
        return;

      toggleGameStart(false);
      toggleGameOver(true);
    });
  }, [controlledCar, enemyCars]);

  useEffect(() => {
    if (gameOver) {
      const difficultyScores =
        topScoresData[difficultyLevels[gameDifficulty - 1]];
      const handleScore = async (data, scores) => {
        try {
          await axios.post("/api/scores", {
            ...data,
          });
          if (score > scores[scores.length - 1].score) {
            const resp = await axios.get("/api/scores");
            setTopScoresData(resp.data.topScores);
          }
        } catch (error) {
          console.log(error);
        }
      };
      handleScore(
        {
          username,
          password: password ? password : "",
          score,
          difficulty: gameDifficulty,
        },
        difficultyScores
      );
      toggleGameOver(false);
    }
  }, [gameOver]);

  // start/stop a game
  async function startGame() {
    if (passwordRequired && password.length) {
      try {
        await axios.post("/api/users/login", {
          username,
          password,
        });
      } catch (error) {
        setPasswordError("Invalid attempt to unlock username");
        return;
      }
    } else if (passwordRequired) {
      setPasswordError(
        "You must type in a password to play with this username"
      );
      return;
    }
    if (gameDifficulty === 1) {
      increaseEnemyMaxCarSpeed(MAX_SPEED);
    } else if (gameDifficulty === 2) {
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
                {difficultyLevels[chosenTopDifficultyLevel].toUpperCase()}
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
            {topScoresData
              ? topScoresData[difficultyLevels[chosenTopDifficultyLevel]].map(
                  (el, index) => {
                    switch (index) {
                      case 0:
                        return (
                          <li key={index} className="first">
                            <i className="fas fa-trophy"></i>
                            {" " + decodeURI(el.username) + " " + el.score}
                          </li>
                        );
                      case 1:
                        return (
                          <li key={index} className="second">
                            <i className="fas fa-trophy"></i>
                            {" " + decodeURI(el.username) + " " + el.score}
                          </li>
                        );
                      case 2:
                        return (
                          <li key={index} className="third">
                            <i className="fas fa-trophy"></i>
                            {" " + decodeURI(el.username) + " " + el.score}
                          </li>
                        );
                      default:
                        return (
                          <li key={index}>
                            {index + 1}.{" "}
                            {decodeURI(el.username) + " " + el.score}
                          </li>
                        );
                    }
                  }
                )
              : [...Array(10).keys()].map((el, index) => {
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
            {!gameStarted && (
              <Fragment>
                <div className="btn-group">
                  <button
                    onClick={() => {
                      adjustGameDifficulty(1);
                    }}
                    className={`${gameDifficulty === 1 && "selected"}`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => {
                      adjustGameDifficulty(2);
                    }}
                    className={`${gameDifficulty === 2 && "selected"}`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => {
                      adjustGameDifficulty(3);
                    }}
                    className={`${gameDifficulty === 3 && "selected"}`}
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
                        checkUsername(e.target.value);
                      }}
                      placeholder="Your username"
                    />
                    <label htmlFor="username">Username</label>
                  </span>
                </div>
                {usernameError && (
                  <div className="error-message text-center">
                    {usernameError}
                  </div>
                )}
                <div className="text-center lock-username">
                  {!passwordRequired && !usernameError && (
                    <span
                      onClick={() => {
                        toggleLockUsername(!enableUsernameLock);
                      }}
                    >
                      Lock my username
                    </span>
                  )}
                  {(passwordRequired || enableUsernameLock) && (
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
                              checkPassword(e.target.value);
                            }}
                            placeholder="Your password"
                          />
                          <label htmlFor="password">Password</label>
                        </span>
                      </div>
                      {passwordError && (
                        <div className="error-message text-center">
                          {passwordError}
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
              </Fragment>
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
                  if (!Boolean(username)) {
                    setUsernameError("Username field must be filled in");
                  } else if (username.length > 19) {
                    setUsernameError("Username must be max 20 characters long");
                  } else {
                    if (passwordRequired && !password) {
                      setUsernameError(
                        "Username locked, password is required before start."
                      );
                      return;
                    }
                    setUsernameError("");
                    startGame();
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
