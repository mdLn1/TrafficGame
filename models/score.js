let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let scoreSchema = new Schema({
  score: { type: Number, required: true },
  username: { type: String, required: true },
  difficulty: {type: Number, default: 1}, // 1 - easy, 2 - medium, 3 - Hard
  registeredOn: { type: String, default: Date.now },
});

module.exports = mongoose.model("Scores", scoreSchema);
