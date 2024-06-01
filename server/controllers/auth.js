const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.checkAuth = async (req, res) => {
  if (!req.session.user) {
    // console.log("Not logged in");
    return res.status(200).json({ status: false });
  }

  const user = await User.findOne({ _id: req.session.user });
  if (!user) {
    return res.status(200).json({ status: false });
  }

  return res
    .status(200)
    .json({ status: true, user: { uid: user._id, image: user.profile } });
};

exports.login = async (req, res) => {
  // Get user data
  const { email, password } = req.body;

  // console.log(email, password);

  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ Message: "User doesn't exist!" });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(200).json({ Message: "Wrong password!" });
  }

  try {
    req.session.user = user._id;

    res.status(200).json({
      status: "success",
      user: {
        image: user.profile,
        uid: user._id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
