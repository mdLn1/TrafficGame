const User = require("../models/user");
const HttpError = require("../utils/httpError");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user)
    throw new HttpError(
      "This username is already registered",
      400,
      1
    );
  if (password.length < 5)
    throw new HttpError("Please choose a more secure password");
  if (password.length > 100)
    throw new HttpError("Password too long, max 100 characters allowed.");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let newUser = new User({ username: username, password: hashedPassword });
  await newUser.save();
  return res.status(201).json();
}

async function authorizeUser(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new HttpError(
      "Invalid credentials, please make sure you typed everything correctly",
      400,
      2
    );
  return res.status(204).send();
}

async function verifyUsernameLocked(req, res) {
  const { username } = req.query;
  const user = await User.findOne({ username });
  if (user)
    throw new HttpError(
      "Username locked already, you will need to provide a password",
      400,
      1
    );
  return res.status(204).send();
}

module.exports = { createUser, authorizeUser, verifyUsernameLocked };
