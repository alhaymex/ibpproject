const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.search = async (req, res) => {
  const { q } = req.params;

  const fintdusers = await User.find({
    $or: [
      {
        firstname: { $regex: q, $options: "i" },
      },
    ],
  });

  const users = [
    ...fintdusers.map((user) => ({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    })),
  ];

  res.json(users);
};

exports.getUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Access Denied", status: false });
    }

    const adminId = req.session.user;

    const isAdmin = await User.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(401).json({ message: "Access Denied", status: false });
    }

    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(200).json({ message: "User not found", status: false });
    }

    const resUser = {
      image: user.profile,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    res.status(200).json({ status: true, user: resUser });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Access Denied", status: false });
    }

    const adminId = req.session.user;
    const isAdmin = await User.findById(adminId);
    if (!isAdmin || isAdmin.role !== "admin") {
      return res.status(401).json({ message: "Access Denied", status: false });
    }

    const { userId, firstname, lastname, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    // if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: false });
  }
};

exports.addUser = async (req, res) => {
  try {
    let { firstname, lastname, email, password, role } = req.body;

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
      role,
    });

    await user.save();

    res.status(200).json({ status: true, message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};
