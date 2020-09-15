let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredDate: { type: Date, default: Date.now },
});

userSchema.statics.isUsernameNotAvailable = async function (username) {
  return (await this.findOne({ username: new RegExp(username, "i") }))
    ? true
    : false;
};

module.exports = mongoose.model("Users", userSchema);
