const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const exceptionHandler = require("../utils/exceptionHandler");
const errorChecker = require("../middleware/errorCheckerMiddleware");
const { getTopScores, saveScore } = require("../controllers/scoresController");

//@route POST api/scores/
//@desc Create new score
//@access Public
router.post(
  "/",
  [
    check(
      "username",
      "Username must be at least 1 characters long and maximum 20"
    )
      .trim()
      .isLength({ min: 1, max: 20 }),
    check("score", "Score must be a positive number").isInt(),
    check("difficulty", "Game difficulty must be an integer").isInt(),
    errorChecker,
  ],
  exceptionHandler(saveScore)
);

//@route GET api/scores/
//@desc Get top scores
//@access Public
router.get("/", exceptionHandler(getTopScores));

module.exports = router;
