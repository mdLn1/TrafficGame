const User = require("../models/user");
const HttpError = require("../utils/httpError");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
  const { username, password } = req.body;
  if (await User.isUsernameNotAvailable(username))
    throw new HttpError("Username locked already", 400);
  if (password.length < 5)
    throw new HttpError("Please choose a more secure password");
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
      400
    );
  return res.status(204).send();
}

async function verifyUsernameLocked(req, res) {
  const { username } = req.body;
  if (await User.isUsernameNotAvailable(username))
    throw new HttpError("Username locked already", 400);
  return res.status(204).send();
}

module.exports = { createUser, authorizeUser, verifyUsernameLocked };
