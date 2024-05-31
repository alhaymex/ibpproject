const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  // Get user data
  const { email, password } = req.body;

  console.log(email, password);

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
        image: user.image,
        uid: user._id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
