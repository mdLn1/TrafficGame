const Score = require("../models/score");
const HttpError = require("../utils/httpError");

async function saveScore(req, res) {
  const { username, score, difficulty } = req.body;
  let newScore = new Score({ username, score });
  if (difficulty) score.difficulty = difficulty;
  await newScore.save();
  return res.status(201).json({ newScore });
}

async function getTopScores(req, res) {
  let hardTopScores = await Score.find({ difficulty: 3 })
    .select("-_id -difficulty")
    .sort({ scores: -1 })
    .limit(10);
  let mediumTopScores = await Score.find({ difficulty: 2 })
    .select("-_id -difficulty")
    .sort({ scores: -1 })
    .limit(10);
  let easyTopScores = await Score.find({ difficulty: 1 })
    .select("-_id -difficulty")
    .sort({ scores: -1 })
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
