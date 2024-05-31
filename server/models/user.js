const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seed = Math.floor(Math.random() * 1000000);

const userSchama = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: String, default: seed },
});

module.exports = mongoose.model("User", userSchama);
