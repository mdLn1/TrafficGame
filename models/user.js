let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  registeredDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", userSchema);
