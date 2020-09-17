const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const exceptionHandler = require("../utils/exceptionHandler");
const errorChecker = require("../middleware/errorCheckerMiddleware");
const {
  createUser,
  authorizeUser,
  verifyUsernameLocked,
} = require("../controllers/usersController");

//@route POST api/user/
//@desc Create new user
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
    check(
      "password",
      "Password must be at least 5 characters long and maximum 100"
    )
      .trim()
      .isLength({ min: 5, max: 100 }),
    errorChecker,
  ],
  exceptionHandler(createUser)
);

//@route GET api/user/verify-username
//@desc Verify username not taken
//@access Public
router.get(
  "/verify-username",
  [
    check(
      "username",
      "Username must be at least 1 character long and maximum 20"
    )
      .trim()
      .isLength({ min: 1, max: 20 }),
    errorChecker,
  ],
  exceptionHandler(verifyUsernameLocked)
);

//@route POST api/user/login
//@desc Authorize existing user
//@access Public
router.post(
  "/login",
  [
    check("username", "Invalid username").trim().isLength({ min: 1, max: 20 }),
    check("password", "Invalid password").trim().isLength({ min: 1, max: 100 }),
    errorChecker,
  ],
  exceptionHandler(authorizeUser)
);

module.exports = router;
