const User = require("../models/user");

const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({ message: "User doesn't exist!" });
  }

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(200).json({ message: "Incorrect password!" });
  }
};
