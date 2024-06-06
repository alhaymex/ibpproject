const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchama = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: String, required: true },
  role: { type: String, default: "user" },
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
    },
  ],
});

module.exports = mongoose.model("User", userSchama);
