const Score = require("../models/score");
const User = require("../models/user");
const HttpError = require("../utils/httpError");
const bcrypt = require("bcryptjs");

async function saveScore(req, res) {
  const { username, password, score, difficulty } = req.body;
  const user = await User.findOne({ username: username });
  if (user && !password)
    throw new HttpError(
      "Invalid credentials, this username is locked and the password entered does not match.",
      400
    );
  if (user && !(await bcrypt.compare(password, user.password)))
    throw new HttpError(
      "Invalid credentials, this username is locked and the password entered does not match.",
      400
    );
  let topScores = await Score.find({ difficulty: difficulty })
    .sort({ score: -1 })
    .limit(10);
  let newScore = new Score({ username, score, difficulty });
  if (topScores.length === 10) {
    if (newScore.score > topScores[9].score) await newScore.save();
  } else await newScore.save();
  return res.status(201).json({ newScore });
}

async function getTopScores(req, res) {
  let hardTopScores = await Score.find({ difficulty: 3 })
    .select("-_id -difficulty -_v")
    .sort({ score: -1 })
    .limit(10);
  let mediumTopScores = await Score.find({ difficulty: 2 })
    .select("-_id -difficulty -_v")
    .sort({ score: -1 })
    .limit(10);
  let easyTopScores = await Score.find({ difficulty: 1 })
    .select("-_id -difficulty -_v")
    .sort({ score: -1 })
    .limit(10);
  return res.status(200).json({
    topScores: {
      easy: easyTopScores,
      medium: mediumTopScores,
      hard: hardTopScores,
    },
  });
}

module.exports = { saveScore, getTopScores };
