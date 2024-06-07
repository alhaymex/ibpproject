const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.clearCookie("sid");
    res.redirect("/");
  });
};

exports.checkAuth = async (req, res) => {
  if (!req.session.user) {
    // console.log("Not logged in");
    return res.status(200).json({ status: false });
  }

  const user = await User.findOne({ _id: req.session.user });
  if (!user) {
    return res.status(200).json({ status: false });
  }

  return res.status(200).json({
    status: true,
    user: { uid: user._id, image: user.profile, role: user.role },
  });
};

exports.login = async (req, res) => {
  // Get user data
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({ message: "User doesn't exist!", status: false });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(200).json({ message: "Wrong password!", status: false });
  }

  try {
    req.session.user = user._id;

    res.status(200).json({
      status: true,
      user: {
        image: user.profile,
        uid: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.register = async (req, res) => {
  let { firstname, lastname, email, password } = req.body;

  firstname = firstname.toLowerCase();
  const str0 = firstname;
  firstname = str0.charAt(0).toUpperCase() + str0.slice(1);

  lastname = lastname.toLowerCase();
  const str1 = lastname;
  lastname = str1.charAt(0).toUpperCase() + str1.slice(1);

  email = email.toLowerCase();

  const checkUser = await User.findOne({ email });
  if (checkUser)
    return res
      .status(200)
      .json({ message: "User already exists!", status: false });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    profile: `https://api.dicebear.com/7.x/initials/svg?seed=${
      firstname + " " + lastname
    }.svg`,
  });

  try {
    await user.save();
    res.status(200).json({ status: true, message: "Registered successfully" });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

exports.profile = async (req, res) => {
  if (!req.session.user) {
    return res.status(200).json({ status: false });
  }
  const userID = req.session.user;

  const user = await User.findOne({ _id: userID });

  res.status(200).json({
    status: true,
    user: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
  });
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(200).json({ status: false });
    }
    const userId = req.session.user;
    const { firstname, lastname, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!", status: false });
  }
};
